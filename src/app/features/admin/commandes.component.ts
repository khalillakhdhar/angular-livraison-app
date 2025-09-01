import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Commande } from '../../core/interfaces/commande';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-commandes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="commandes-container">
      <div class="page-header">
        <h2>Gestion des Commandes</h2>
        <p class="subtitle">Vue d'ensemble et gestion de toutes les commandes</p>
      </div>

      <!-- Filtres -->
      <div class="filters-section glass-card">
        <div class="filters-row">
          <div class="filter-group">
            <label for="statusFilter">Statut</label>
            <select id="statusFilter" class="futuristic-input" (change)="onStatusFilter($event)">
              <option value="">Tous les statuts</option>
              <option value="nouvelle">Nouvelle</option>
              <option value="en_cours">En cours</option>
              <option value="livree">Livrée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="dateFilter">Période</label>
            <select id="dateFilter" class="futuristic-input">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="all">Toutes</option>
            </select>
          </div>

          <button class="neon-btn" (click)="refreshOrders()">
            <i class="material-icons">refresh</i>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="quick-stats grid grid-4">
        <div class="stat-card">
          <div class="stat-value text-neon">{{ getTotalByStatus('nouvelle') }}</div>
          <div class="stat-label">Nouvelles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-success">{{ getTotalByStatus('en_cours') }}</div>
          <div class="stat-label">En cours</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-warning">{{ getTotalByStatus('livree') }}</div>
          <div class="stat-label">Livrées</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: var(--neon-magenta);">{{ getTotalByStatus('annulee') }}</div>
          <div class="stat-label">Annulées</div>
        </div>
      </div>

      <!-- Table des commandes -->
      <div class="orders-table glass-card">
        <div class="table-header">
          <h3>Liste des Commandes</h3>
          <div class="table-actions">
            <button class="neon-btn success" (click)="exportOrders()">
              <i class="material-icons">file_download</i>
              Exporter
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="futuristic-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Livreur</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders; trackBy: trackByOrderId">
                <td>
                  <div class="order-number">{{ order.numeroCommande }}</div>
                </td>
                <td>
                  <div class="client-info">
                    <div class="client-name">Client {{ order.clientId.slice(-6) }}</div>
                    <div class="client-address">{{ order.adresseLivraison.ville }}</div>
                  </div>
                </td>
                <td>
                  <div class="driver-info">
                    <span *ngIf="order.livreurId; else noDriver">
                      Livreur {{ order.livreurId.slice(-6) }}
                    </span>
                    <ng-template #noDriver>
                      <span class="no-driver">Non assigné</span>
                    </ng-template>
                  </div>
                </td>
                <td>
                  <div class="amount">{{ order.montantFinal | currency:'EUR':'symbol':'1.2-2' }}</div>
                </td>
                <td>
                  <span class="status-badge" [class]="'status-' + order.statut">
                    {{ getStatusLabel(order.statut) }}
                  </span>
                </td>
                <td>
                  <div class="date-info">
                    <div class="date">{{ formatDate(order.dateCreation) }}</div>
                    <div class="time">{{ formatTime(order.dateCreation) }}</div>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="action-btn" [title]="'Voir détails'" (click)="viewOrder(order)">
                      <i class="material-icons">visibility</i>
                    </button>
                    <button class="action-btn" [title]="'Modifier'" (click)="editOrder(order)">
                      <i class="material-icons">edit</i>
                    </button>
                    <button class="action-btn danger" [title]="'Supprimer'" (click)="deleteOrder(order)">
                      <i class="material-icons">delete</i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredOrders.length === 0" class="no-data">
            <i class="material-icons">inbox</i>
            <p>Aucune commande trouvée</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .commandes-container {
      animation: fadeInUp 0.6s ease-out;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-cyan);
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .filters-section {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .filters-row {
      display: flex;
      align-items: end;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .filter-group select {
      min-width: 150px;
    }

    .quick-stats {
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
    }

    .orders-table {
      padding: 2rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .table-header h3 {
      margin: 0;
      color: var(--neon-cyan);
    }

    .table-actions {
      display: flex;
      gap: 1rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .order-number {
      font-family: var(--font-primary);
      font-weight: 700;
      color: var(--neon-cyan);
    }

    .client-info,
    .driver-info,
    .date-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .client-name,
    .client-address {
      font-size: 0.9rem;
    }

    .client-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .client-address {
      color: var(--text-secondary);
    }

    .no-driver {
      color: var(--text-muted);
      font-style: italic;
    }

    .amount {
      font-family: var(--font-primary);
      font-weight: 700;
      color: var(--neon-green);
      font-size: 1.1rem;
    }

    .date {
      color: var(--text-primary);
      font-weight: 500;
    }

    .time {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      background: rgba(0, 255, 255, 0.1);
      color: var(--neon-cyan);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .action-btn.danger {
      background: rgba(255, 0, 255, 0.1);
      color: var(--neon-magenta);
    }

    .action-btn.danger:hover {
      background: rgba(255, 0, 255, 0.2);
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    .no-data i {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .no-data p {
      font-size: 1.1rem;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group select {
        min-width: auto;
      }

      .quick-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .futuristic-table {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .quick-stats {
        grid-template-columns: 1fr;
      }

      .orders-table {
        padding: 1rem;
      }
    }
  `]
})
export class AdminCommandesComponent implements OnInit {
  orders: Commande[] = [];
  filteredOrders: Commande[] = [];
  currentStatusFilter = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.filterOrders();
    });
  }

  onStatusFilter(event: any): void {
    this.currentStatusFilter = event.target.value;
    this.filterOrders();
  }

  private filterOrders(): void {
    if (this.currentStatusFilter) {
      this.filteredOrders = this.orders.filter(order => order.statut === this.currentStatusFilter);
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  getTotalByStatus(status: string): number {
    return this.orders.filter(order => order.statut === status).length;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'nouvelle': 'Nouvelle',
      'en_cours': 'En cours',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  }

  formatDate(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('fr-FR');
  }

  formatTime(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  trackByOrderId(index: number, order: Commande): string {
    return order.id;
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  viewOrder(order: Commande): void {
    // TODO: Implémenter la vue détail de commande
    console.log('Voir commande:', order);
  }

  editOrder(order: Commande): void {
    // TODO: Implémenter l'édition de commande
    console.log('Éditer commande:', order);
  }

  deleteOrder(order: Commande): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.orderService.deleteOrder(order.id).then(success => {
        if (success) {
          this.loadOrders();
        }
      });
    }
  }

  exportOrders(): void {
    // TODO: Implémenter l'export des commandes
    console.log('Export commandes');
  }
}