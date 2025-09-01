import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Commande } from '../../core/interfaces/commande';

@Component({
  selector: 'app-livreur-livraisons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="livraisons-container">
      <div class="page-header">
        <h2>Mes Livraisons</h2>
        <p class="subtitle">Historique complet de vos livraisons</p>
      </div>

      <!-- Filtres -->
      <div class="filters-section glass-card">
        <div class="filters-row">
          <div class="filter-group">
            <label for="statusFilter">Statut</label>
            <select id="statusFilter" class="futuristic-input" (change)="onStatusFilter($event)">
              <option value="">Tous les statuts</option>
              <option value="nouvelle">Nouvelles</option>
              <option value="en_cours">En cours</option>
              <option value="livree">Livrées</option>
              <option value="annulee">Annulées</option>
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
          <div class="stat-value text-warning">{{ getTotalByStatus('en_cours') }}</div>
          <div class="stat-label">En cours</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-success">{{ getTotalByStatus('livree') }}</div>
          <div class="stat-label">Livrées</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: var(--neon-magenta);">{{ getTotalByStatus('annulee') }}</div>
          <div class="stat-label">Annulées</div>
        </div>
      </div>

      <!-- Table des livraisons -->
      <div class="orders-table glass-card">
        <div class="table-header">
          <h3>Liste des Livraisons</h3>
          <div class="table-info">
            <span>{{ filteredOrders.length }} livraison(s)</span>
          </div>
        </div>

        <div class="table-container">
          <table class="futuristic-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Adresse</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders; trackBy: trackByOrderId">
                <td>
                  <div class="order-info">
                    <div class="order-number">{{ order.numeroCommande }}</div>
                    <div class="order-items">{{ order.articles.length }} article(s)</div>
                  </div>
                </td>
                <td>
                  <div class="address-info">
                    <div class="address-main">{{ order.adresseLivraison.rue }}</div>
                    <div class="address-city">{{ order.adresseLivraison.ville }} {{ order.adresseLivraison.codePostal }}</div>
                  </div>
                </td>
                <td>
                  <div class="amount-info">
                    <div class="total-amount">{{ order.montantFinal | currency:'EUR':'symbol':'1.2-2' }}</div>
                    <div class="delivery-fee">Livraison: {{ order.fraisLivraison | currency:'EUR':'symbol':'1.2-2' }}</div>
                  </div>
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
                  <div class="duration-info">
                    <span *ngIf="order.dateLivraison && order.dateAcceptation; else noDuration">
                      {{ formatDuration(order.dateAcceptation, order.dateLivraison) }}
                    </span>
                    <ng-template #noDuration>
                      <span class="no-duration">-</span>
                    </ng-template>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="action-btn" [title]="'Voir détails'" (click)="viewOrderDetails(order)">
                      <i class="material-icons">visibility</i>
                    </button>
                    <button class="action-btn" [title]="'Voir sur carte'" (click)="viewOnMap(order)">
                      <i class="material-icons">map</i>
                    </button>
                    <button 
                      class="action-btn success" 
                      [title]="'Marquer comme livrée'" 
                      *ngIf="order.statut === 'en_cours'"
                      (click)="markAsDelivered(order)"
                    >
                      <i class="material-icons">check_circle</i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredOrders.length === 0" class="no-data">
            <i class="material-icons">local_shipping</i>
            <p>Aucune livraison trouvée</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .livraisons-container {
      animation: fadeInUp 0.6s ease-out;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-green);
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
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
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
      color: var(--neon-green);
    }

    .table-info {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .order-info,
    .address-info,
    .amount-info,
    .date-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .order-number {
      font-family: var(--font-primary);
      font-weight: 700;
      color: var(--neon-green);
    }

    .order-items {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .address-main {
      font-weight: 600;
      color: var(--text-primary);
    }

    .address-city {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .total-amount {
      font-family: var(--font-primary);
      font-weight: 700;
      color: var(--neon-green);
      font-size: 1.1rem;
    }

    .delivery-fee {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .date {
      color: var(--text-primary);
      font-weight: 500;
    }

    .time {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .duration-info {
      font-family: var(--font-primary);
      font-weight: 600;
      color: var(--neon-cyan);
    }

    .no-duration {
      color: var(--text-muted);
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
      background: rgba(0, 255, 0, 0.1);
      color: var(--neon-green);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: rgba(0, 255, 0, 0.2);
      transform: scale(1.1);
    }

    .action-btn.success {
      background: rgba(0, 255, 255, 0.1);
      color: var(--neon-cyan);
    }

    .action-btn.success:hover {
      background: rgba(0, 255, 255, 0.2);
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
export class LivreurLivraisonsComponent implements OnInit {
  orders: Commande[] = [];
  filteredOrders: Commande[] = [];
  currentStatusFilter = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.orderService.getOrdersByDelivery(currentUser.uid).subscribe(orders => {
        this.orders = orders;
        this.filterOrders();
      });
    }
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

  formatDuration(startTime: number, endTime: number): string {
    const duration = endTime - startTime;
    const minutes = Math.round(duration / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  }

  trackByOrderId(index: number, order: Commande): string {
    return order.id;
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  viewOrderDetails(order: Commande): void {
    // TODO: Implémenter la vue détail de commande
    console.log('Voir détails:', order);
  }

  viewOnMap(order: Commande): void {
    // TODO: Naviguer vers la carte avec cette commande
    console.log('Voir sur carte:', order);
  }

  markAsDelivered(order: Commande): void {
    if (confirm('Marquer cette commande comme livrée ?')) {
      this.orderService.updateOrderStatus(order.id, 'livree').then(success => {
        if (success) {
          this.loadOrders();
        }
      });
    }
  }
}