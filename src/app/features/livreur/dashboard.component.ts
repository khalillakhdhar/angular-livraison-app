import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Commande } from '../../core/interfaces/commande';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Tableau de Bord Livreur</h2>
        <p class="subtitle">Vos livraisons et statistiques du jour</p>
      </div>

      <!-- Statistiques rapides -->
      <div class="stats-grid grid grid-4">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">assignment</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ assignedOrders.length }}</div>
            <div class="stat-label">Livraisons assignées</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <i class="material-icons">check_circle</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getCompletedTodayCount() }}</div>
            <div class="stat-label">Livrées aujourd'hui</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <i class="material-icons">schedule</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getPendingCount() }}</div>
            <div class="stat-label">En attente</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <i class="material-icons">euro</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ calculateTodayEarnings() | currency:'EUR':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Gains du jour</div>
          </div>
        </div>
      </div>

      <!-- Livraisons assignées -->
      <div class="assigned-orders glass-card">
        <div class="section-header">
          <h3>Livraisons Assignées</h3>
          <button class="neon-btn" (click)="refreshOrders()">
            <i class="material-icons">refresh</i>
            Actualiser
          </button>
        </div>

        <div class="orders-list" *ngIf="assignedOrders.length > 0; else noOrders">
          <div class="order-card" *ngFor="let order of assignedOrders; trackBy: trackByOrderId">
            <div class="order-header">
              <div class="order-number">{{ order.numeroCommande }}</div>
              <span class="status-badge" [class]="'status-' + order.statut">
                {{ getStatusLabel(order.statut) }}
              </span>
            </div>

            <div class="order-details">
              <div class="detail-row">
                <i class="material-icons">place</i>
                <div class="detail-content">
                  <div class="detail-label">Livraison</div>
                  <div class="detail-value">
                    {{ order.adresseLivraison.rue }}, {{ order.adresseLivraison.ville }}
                  </div>
                </div>
              </div>

              <div class="detail-row">
                <i class="material-icons">euro</i>
                <div class="detail-content">
                  <div class="detail-label">Montant</div>
                  <div class="detail-value">{{ order.montantFinal | currency:'EUR':'symbol':'1.2-2' }}</div>
                </div>
              </div>

              <div class="detail-row">
                <i class="material-icons">access_time</i>
                <div class="detail-content">
                  <div class="detail-label">Commandé</div>
                  <div class="detail-value">{{ formatTime(order.dateCreation) }}</div>
                </div>
              </div>

              <div class="detail-row" *ngIf="order.instructionsLivraison">
                <i class="material-icons">note</i>
                <div class="detail-content">
                  <div class="detail-label">Instructions</div>
                  <div class="detail-value">{{ order.instructionsLivraison }}</div>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button 
                class="action-btn primary"
                *ngIf="order.statut === 'nouvelle'"
                (click)="acceptOrder(order)"
              >
                <i class="material-icons">check</i>
                Accepter
              </button>

              <button 
                class="action-btn success"
                *ngIf="order.statut === 'en_cours'"
                (click)="completeOrder(order)"
              >
                <i class="material-icons">done_all</i>
                Marquer livrée
              </button>

              <button 
                class="action-btn"
                (click)="viewOrderMap(order)"
              >
                <i class="material-icons">map</i>
                Voir sur carte
              </button>

              <button 
                class="action-btn danger"
                (click)="cancelOrder(order)"
              >
                <i class="material-icons">cancel</i>
                Annuler
              </button>
            </div>
          </div>
        </div>

        <ng-template #noOrders>
          <div class="no-orders">
            <i class="material-icons">inbox</i>
            <h4>Aucune livraison assignée</h4>
            <p>Vous n'avez actuellement aucune livraison assignée. Nouvelles commandes à venir...</p>
          </div>
        </ng-template>
      </div>

      <!-- Section performance -->
      <div class="performance-section grid grid-2">
        <div class="performance-card glass-card">
          <h3>Performance du Jour</h3>
          <div class="performance-stats">
            <div class="perf-item">
              <div class="perf-label">Livraisons réussies</div>
              <div class="perf-value success">{{ getCompletedTodayCount() }} / {{ assignedOrders.length }}</div>
            </div>
            <div class="perf-item">
              <div class="perf-label">Temps moyen</div>
              <div class="perf-value">{{ getAverageDeliveryTime() }} min</div>
            </div>
            <div class="perf-item">
              <div class="perf-label">Distance parcourue</div>
              <div class="perf-value">{{ getTotalDistance() }} km</div>
            </div>
          </div>
        </div>

        <div class="availability-card glass-card">
          <h3>Statut & Disponibilité</h3>
          <div class="availability-content">
            <div class="status-indicator" [class.active]="isAvailable">
              <div class="status-dot"></div>
              <span>{{ isAvailable ? 'Disponible' : 'Indisponible' }}</span>
            </div>
            
            <button 
              class="neon-btn"
              [class.success]="!isAvailable"
              [class.warning]="isAvailable"
              (click)="toggleAvailability()"
            >
              {{ isAvailable ? 'Se mettre indisponible' : 'Se mettre disponible' }}
            </button>

            <div class="working-hours">
              <div class="hours-label">Heures de service</div>
              <div class="hours-value">{{ getWorkingHours() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      animation: fadeInUp 0.6s ease-out;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-green);
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .stats-grid {
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--neon-green);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(0, 255, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neon-green);
    }

    .stat-icon i {
      font-size: 1.8rem;
      color: var(--neon-green);
    }

    .stat-icon.success {
      background: rgba(0, 255, 255, 0.2);
      border-color: var(--neon-cyan);
    }

    .stat-icon.success i {
      color: var(--neon-cyan);
    }

    .stat-icon.warning {
      background: rgba(255, 136, 0, 0.2);
      border-color: var(--neon-orange);
    }

    .stat-icon.warning i {
      color: var(--neon-orange);
    }

    .stat-icon.info {
      background: rgba(255, 255, 0, 0.2);
      border-color: var(--neon-yellow);
    }

    .stat-icon.info i {
      color: var(--neon-yellow);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-family: var(--font-primary);
      font-weight: 900;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0.25rem;
    }

    .assigned-orders {
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
      color: var(--neon-green);
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      border-color: var(--neon-green);
      background: rgba(255, 255, 255, 0.05);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .order-number {
      font-family: var(--font-primary);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--neon-green);
    }

    .order-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .detail-row i {
      color: var(--neon-green);
      font-size: 1.1rem;
      margin-top: 0.1rem;
    }

    .detail-content {
      flex: 1;
    }

    .detail-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.25rem;
    }

    .detail-value {
      color: var(--text-primary);
      font-weight: 500;
    }

    .order-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(0, 255, 0, 0.3);
      background: rgba(0, 255, 0, 0.1);
      color: var(--neon-green);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .action-btn:hover {
      background: rgba(0, 255, 0, 0.2);
      transform: translateY(-1px);
    }

    .action-btn.primary {
      border-color: var(--neon-cyan);
      background: rgba(0, 255, 255, 0.1);
      color: var(--neon-cyan);
    }

    .action-btn.primary:hover {
      background: rgba(0, 255, 255, 0.2);
    }

    .action-btn.success {
      border-color: var(--neon-green);
      background: rgba(0, 255, 0, 0.1);
      color: var(--neon-green);
    }

    .action-btn.danger {
      border-color: var(--neon-magenta);
      background: rgba(255, 0, 255, 0.1);
      color: var(--neon-magenta);
    }

    .action-btn.danger:hover {
      background: rgba(255, 0, 255, 0.2);
    }

    .no-orders {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    .no-orders i {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .no-orders h4 {
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .no-orders p {
      margin: 0;
      line-height: 1.5;
    }

    .performance-section {
      gap: 2rem;
    }

    .performance-card,
    .availability-card {
      padding: 2rem;
    }

    .performance-card h3,
    .availability-card h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-green);
    }

    .performance-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .perf-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .perf-label {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .perf-value {
      color: var(--text-primary);
      font-weight: 700;
      font-family: var(--font-primary);
    }

    .perf-value.success {
      color: var(--neon-green);
    }

    .availability-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      background: rgba(255, 0, 255, 0.1);
      border: 1px solid var(--neon-magenta);
      color: var(--neon-magenta);
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .status-indicator.active {
      background: rgba(0, 255, 0, 0.1);
      border-color: var(--neon-green);
      color: var(--neon-green);
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--neon-magenta);
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.active .status-dot {
      background: var(--neon-green);
    }

    .working-hours {
      text-align: center;
    }

    .hours-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .hours-value {
      color: var(--text-primary);
      font-weight: 600;
      font-family: var(--font-primary);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .performance-section {
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

      .assigned-orders,
      .performance-card,
      .availability-card {
        padding: 1rem;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
    }
  `]
})
export class LivreurDashboardComponent implements OnInit {
  assignedOrders: Commande[] = [];
  isAvailable = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAssignedOrders();
  }

  private loadAssignedOrders(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.orderService.getOrdersByDelivery(currentUser.uid).subscribe(orders => {
        this.assignedOrders = orders;
      });
    }
  }

  getCompletedTodayCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.assignedOrders.filter(order => 
      order.statut === 'livree' && 
      order.dateLivraison && 
      order.dateLivraison >= today.getTime()
    ).length;
  }

  getPendingCount(): number {
    return this.assignedOrders.filter(order => 
      order.statut === 'nouvelle' || order.statut === 'en_cours'
    ).length;
  }

  calculateTodayEarnings(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.assignedOrders
      .filter(order => 
        order.statut === 'livree' && 
        order.dateLivraison && 
        order.dateLivraison >= today.getTime()
      )
      .reduce((total, order) => total + (order.fraisLivraison || 0), 0);
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

  formatTime(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByOrderId(index: number, order: Commande): string {
    return order.id;
  }

  refreshOrders(): void {
    this.loadAssignedOrders();
  }

  acceptOrder(order: Commande): void {
    this.orderService.updateOrderStatus(order.id, 'en_cours').then(success => {
      if (success) {
        this.loadAssignedOrders();
      }
    });
  }

  completeOrder(order: Commande): void {
    if (confirm('Confirmer la livraison de cette commande ?')) {
      this.orderService.updateOrderStatus(order.id, 'livree').then(success => {
        if (success) {
          this.loadAssignedOrders();
        }
      });
    }
  }

  cancelOrder(order: Commande): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.orderService.updateOrderStatus(order.id, 'annulee').then(success => {
        if (success) {
          this.loadAssignedOrders();
        }
      });
    }
  }

  viewOrderMap(order: Commande): void {
    // TODO: Implémenter la navigation vers la carte avec cette commande
    console.log('Voir sur carte:', order);
  }

  toggleAvailability(): void {
    this.isAvailable = !this.isAvailable;
    // TODO: Mettre à jour le statut dans Firestore
  }

  getAverageDeliveryTime(): string {
    const completedOrders = this.assignedOrders.filter(order => 
      order.statut === 'livree' && order.dateAcceptation && order.dateLivraison
    );

    if (completedOrders.length === 0) return '-';

    const totalTime = completedOrders.reduce((total, order) => {
      return total + (order.dateLivraison! - order.dateAcceptation!);
    }, 0);

    const averageMs = totalTime / completedOrders.length;
    const averageMinutes = Math.round(averageMs / (1000 * 60));

    return averageMinutes.toString();
  }

  getTotalDistance(): string {
    // TODO: Calculer la distance totale parcourue
    return '42.5';
  }

  getWorkingHours(): string {
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(20, 0, 0, 0);

    return `${startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
}