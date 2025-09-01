import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { UserService, OrderService, DriverService, SortieService } from '../../../core/services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Tableau de bord</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card users">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{userStats.total}}</div>
                <div class="stat-label">Utilisateurs</div>
                <div class="stat-subtitle">{{userStats.actifs}} actifs</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card orders">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>shopping_cart</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{orderStats.total}}</div>
                <div class="stat-label">Commandes</div>
                <div class="stat-subtitle">{{orderStats.nouvelle}} nouvelles</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card drivers">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>delivery_dining</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{driverStats.total}}</div>
                <div class="stat-label">Livreurs</div>
                <div class="stat-subtitle">{{driverStats.disponible}} disponibles</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card sorties">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>route</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{sortieStats.total}}</div>
                <div class="stat-label">Sorties</div>
                <div class="stat-subtitle">{{sortieStats.en_route}} en cours</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-actions">
        <h2>Actions rapides</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/admin/commandes">
            <mat-icon>add</mat-icon>
            Nouvelle commande
          </button>
          <button mat-raised-button color="accent" routerLink="/admin/sorties">
            <mat-icon>route</mat-icon>
            Créer une sortie
          </button>
          <button mat-stroked-button routerLink="/admin/utilisateurs">
            <mat-icon>person_add</mat-icon>
            Ajouter utilisateur
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-title {
      font-size: 32px;
      font-weight: 300;
      margin-bottom: 32px;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
    }

    .stat-card.users {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card.orders {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card.drivers {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.sorties {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 36px;
      font-weight: 600;
      line-height: 1;
    }

    .stat-label {
      font-size: 18px;
      font-weight: 500;
      margin-top: 4px;
    }

    .stat-subtitle {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 2px;
    }

    .dashboard-actions {
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .dashboard-actions h2 {
      margin: 0 0 24px 0;
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      height: 48px;
      border-radius: 24px;
      padding: 0 24px;
      font-weight: 500;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .dashboard-actions {
        padding: 24px 16px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  userStats = { total: 0, actifs: 0, admin: 0, livreur: 0, client: 0 };
  orderStats = { total: 0, nouvelle: 0, assignée: 0, en_cours: 0, livrée: 0, échouée: 0 };
  driverStats = { total: 0, disponible: 0, en_livraison: 0, hors_ligne: 0, actifs: 0 };
  sortieStats = { total: 0, planifiée: 0, en_route: 0, terminée: 0, annulée: 0 };

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private driverService: DriverService,
    private sortieService: SortieService
  ) {}

  async ngOnInit() {
    await this.loadStats();
  }

  private async loadStats() {
    try {
      // Load all statistics
      const [users, orders, drivers, sorties] = await Promise.all([
        this.userService.getUsersCount(),
        this.orderService.getOrdersStats(),
        this.driverService.getDriversStats(),
        this.sortieService.getSortiesStats()
      ]);

      this.userStats = users;
      this.orderStats = orders;
      this.driverStats = drivers;
      this.sortieStats = sorties;
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }
}