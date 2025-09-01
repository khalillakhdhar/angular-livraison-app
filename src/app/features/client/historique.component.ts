import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Commande } from '../../core/interfaces/commande';

@Component({
  selector: 'app-client-historique',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="historique-container">
      <div class="page-header">
        <h2>Historique des Commandes</h2>
        <p class="subtitle">Retrouvez toutes vos commandes passées</p>
      </div>

      <!-- Filtres -->
      <div class="filters-section glass-card">
        <div class="filters-row">
          <div class="filter-group">
            <label for="statusFilter">Statut</label>
            <select id="statusFilter" class="futuristic-input" (change)="onStatusFilter($event)">
              <option value="">Tous les statuts</option>
              <option value="livree">Livrées</option>
              <option value="annulee">Annulées</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="dateFilter">Période</label>
            <select id="dateFilter" class="futuristic-input">
              <option value="all">Toutes</option>
              <option value="month">Ce mois</option>
              <option value="3months">3 derniers mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>

          <button class="neon-btn" (click)="refreshOrders()">
            <i class="material-icons">refresh</i>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid grid grid-4">
        <div class="stat-card">
          <div class="stat-value text-neon">{{ getTotalOrders() }}</div>
          <div class="stat-label">Total commandes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-success">{{ getDeliveredCount() }}</div>
          <div class="stat-label">Livrées</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-warning">{{ getTotalSpent() | currency:'EUR':'symbol':'1.0-0' }}</div>
          <div class="stat-label">Total dépensé</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color: var(--neon-orange);">{{ getAverageRating() }}/5</div>
          <div class="stat-label">Note moyenne</div>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="orders-section" *ngIf="filteredOrders.length > 0; else noOrders">
        <div class="orders-grid">
          <div class="order-card glass-card" *ngFor="let order of filteredOrders; trackBy: trackByOrderId">
            <div class="order-header">
              <div class="order-info">
                <div class="order-number">{{ order.numeroCommande }}</div>
                <div class="order-date">{{ formatDate(order.dateCreation) }}</div>
              </div>
              <span class="status-badge" [class]="'status-' + order.statut">
                {{ getStatusLabel(order.statut) }}
              </span>
            </div>

            <div class="order-content">
              <div class="order-summary">
                <div class="summary-item">
                  <i class="material-icons">shopping_bag</i>
                  <span>{{ order.articles.length }} article(s)</span>
                </div>
                <div class="summary-item">
                  <i class="material-icons">place</i>
                  <span>{{ order.adresseLivraison.ville }}</span>
                </div>
                <div class="summary-item">
                  <i class="material-icons">euro</i>
                  <span>{{ order.montantFinal | currency:'EUR':'symbol':'1.2-2' }}</span>
                </div>
              </div>

              <div class="order-timeline" *ngIf="order.statut === 'livree'">
                <div class="timeline-item">
                  <i class="material-icons">schedule</i>
                  <span>Commandé: {{ formatTime(order.dateCreation) }}</span>
                </div>
                <div class="timeline-item" *ngIf="order.dateAcceptation">
                  <i class="material-icons">local_shipping</i>
                  <span>Prise en charge: {{ formatTime(order.dateAcceptation) }}</span>
                </div>
                <div class="timeline-item" *ngIf="order.dateLivraison">
                  <i class="material-icons">check_circle</i>
                  <span>Livrée: {{ formatTime(order.dateLivraison) }}</span>
                </div>
              </div>

              <div class="order-items">
                <div class="items-preview">
                  <div class="item-pill" *ngFor="let article of order.articles.slice(0, 3)">
                    {{ article.nom }}
                  </div>
                  <div class="item-pill more" *ngIf="order.articles.length > 3">
                    +{{ order.articles.length - 3 }} autre(s)
                  </div>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button class="action-btn" (click)="viewOrderDetails(order)">
                <i class="material-icons">visibility</i>
                Détails
              </button>

              <button 
                class="action-btn" 
                (click)="reorderItems(order)"
                *ngIf="order.statut === 'livree'"
              >
                <i class="material-icons">refresh</i>
                Recommander
              </button>

              <button 
                class="action-btn" 
                (click)="rateOrder(order)"
                *ngIf="order.statut === 'livree' && !order.noteClient"
              >
                <i class="material-icons">star</i>
                Noter
              </button>

              <button 
                class="action-btn" 
                (click)="downloadInvoice(order)"
                *ngIf="order.statut === 'livree'"
              >
                <i class="material-icons">receipt</i>
                Facture
              </button>
            </div>

            <!-- Note si déjà notée -->
            <div class="order-rating" *ngIf="order.noteClient">
              <div class="rating-display">
                <i class="material-icons" *ngFor="let star of getStarsArray(order.noteClient)">
                  {{ star ? 'star' : 'star_border' }}
                </i>
                <span class="rating-text">Votre note: {{ order.noteClient }}/5</span>
              </div>
              <div class="rating-comment" *ngIf="order.commentaireClient">
                "{{ order.commentaireClient }}"
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune commande -->
      <ng-template #noOrders>
        <div class="no-orders glass-card">
          <div class="no-orders-icon">
            <i class="material-icons">history</i>
          </div>
          
          <h3>Aucune commande dans l'historique</h3>
          
          <p>
            Vous n'avez pas encore passé de commande correspondant aux filtres sélectionnés.
          </p>

          <button class="neon-btn primary">
            <i class="material-icons">add_shopping_cart</i>
            Passer ma première commande
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .historique-container {
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

    .stats-grid {
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

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }

    .order-card {
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 255, 255, 0.2);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .order-number {
      font-family: var(--font-primary);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--neon-cyan);
      margin-bottom: 0.25rem;
    }

    .order-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .order-content {
      margin-bottom: 1.5rem;
    }

    .order-summary {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
    }

    .summary-item i {
      color: var(--neon-cyan);
      font-size: 1.1rem;
    }

    .order-timeline {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .timeline-item i {
      color: var(--neon-green);
      font-size: 1rem;
    }

    .order-items {
      margin-bottom: 1.5rem;
    }

    .items-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .item-pill {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 20px;
      padding: 0.25rem 0.75rem;
      font-size: 0.8rem;
      color: var(--neon-cyan);
      font-weight: 500;
    }

    .item-pill.more {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: var(--text-muted);
    }

    .order-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(0, 255, 255, 0.3);
      background: rgba(0, 255, 255, 0.05);
      color: var(--neon-cyan);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .action-btn:hover {
      background: rgba(0, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .action-btn i {
      font-size: 1rem;
    }

    .order-rating {
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .rating-display i {
      color: var(--neon-yellow);
      font-size: 1.1rem;
    }

    .rating-text {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .rating-comment {
      color: var(--text-secondary);
      font-style: italic;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .no-orders {
      padding: 4rem 2rem;
      text-align: center;
    }

    .no-orders-icon {
      margin-bottom: 2rem;
    }

    .no-orders-icon i {
      font-size: 5rem;
      color: var(--text-muted);
      opacity: 0.5;
    }

    .no-orders h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .no-orders p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
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

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .orders-grid {
        grid-template-columns: 1fr;
      }

      .order-actions {
        flex-direction: column;
      }

      .action-btn {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .order-card {
        padding: 1rem;
      }

      .no-orders {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class ClientHistoriqueComponent implements OnInit {
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
      this.orderService.getOrdersByClient(currentUser.uid).subscribe(orders => {
        // Filtrer pour n'afficher que les commandes terminées (livrées ou annulées)
        this.orders = orders.filter(order => 
          order.statut === 'livree' || order.statut === 'annulee'
        );
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

  getTotalOrders(): number {
    return this.orders.length;
  }

  getDeliveredCount(): number {
    return this.orders.filter(order => order.statut === 'livree').length;
  }

  getTotalSpent(): number {
    return this.orders
      .filter(order => order.statut === 'livree')
      .reduce((total, order) => total + order.montantFinal, 0);
  }

  getAverageRating(): number {
    const ratedOrders = this.orders.filter(order => order.noteClient);
    if (ratedOrders.length === 0) return 0;
    
    const totalRating = ratedOrders.reduce((sum, order) => sum + (order.noteClient || 0), 0);
    return Math.round((totalRating / ratedOrders.length) * 10) / 10;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  }

  formatDate(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStarsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  trackByOrderId(index: number, order: Commande): string {
    return order.id;
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  viewOrderDetails(order: Commande): void {
    // TODO: Implémenter la vue détaillée de la commande
    console.log('Voir détails:', order);
  }

  reorderItems(order: Commande): void {
    // TODO: Implémenter la recommande des mêmes articles
    console.log('Recommander:', order);
  }

  rateOrder(order: Commande): void {
    // TODO: Implémenter l'interface de notation
    console.log('Noter commande:', order);
  }

  downloadInvoice(order: Commande): void {
    // TODO: Implémenter le téléchargement de facture
    console.log('Télécharger facture:', order);
  }
}