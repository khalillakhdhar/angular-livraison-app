import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Commande } from '../../core/interfaces/commande';

@Component({
  selector: 'app-client-suivi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="suivi-container">
      <div class="page-header">
        <h2>Suivi de Commande</h2>
        <p class="subtitle">Suivez votre commande en temps réel</p>
      </div>

      <!-- Commande en cours -->
      <div class="active-order-section" *ngIf="activeOrder; else noActiveOrder">
        <div class="order-card glass-card">
          <div class="order-header">
            <div class="order-number">
              <h3>Commande {{ activeOrder.numeroCommande }}</h3>
              <span class="status-badge" [class]="'status-' + activeOrder.statut">
                {{ getStatusLabel(activeOrder.statut) }}
              </span>
            </div>
            <div class="order-time">
              Commandé le {{ formatDateTime(activeOrder.dateCreation) }}
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="progress-section">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                [style.width.%]="getProgressPercentage(activeOrder.statut)"
              ></div>
            </div>

            <div class="progress-steps">
              <div 
                class="step" 
                [class.active]="isStepActive('nouvelle', activeOrder.statut)"
                [class.completed]="isStepCompleted('nouvelle', activeOrder.statut)"
              >
                <div class="step-icon">
                  <i class="material-icons">shopping_cart</i>
                </div>
                <div class="step-label">Commande reçue</div>
                <div class="step-time" *ngIf="activeOrder.dateCreation">
                  {{ formatTime(activeOrder.dateCreation) }}
                </div>
              </div>

              <div 
                class="step" 
                [class.active]="isStepActive('en_cours', activeOrder.statut)"
                [class.completed]="isStepCompleted('en_cours', activeOrder.statut)"
              >
                <div class="step-icon">
                  <i class="material-icons">local_shipping</i>
                </div>
                <div class="step-label">En livraison</div>
                <div class="step-time" *ngIf="activeOrder.dateAcceptation">
                  {{ formatTime(activeOrder.dateAcceptation) }}
                </div>
              </div>

              <div 
                class="step" 
                [class.active]="isStepActive('livree', activeOrder.statut)"
                [class.completed]="isStepCompleted('livree', activeOrder.statut)"
              >
                <div class="step-icon">
                  <i class="material-icons">check_circle</i>
                </div>
                <div class="step-label">Livrée</div>
                <div class="step-time" *ngIf="activeOrder.dateLivraison">
                  {{ formatTime(activeOrder.dateLivraison) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Détails de la commande -->
          <div class="order-details">
            <div class="details-grid grid grid-2">
              <div class="detail-section">
                <h4>Adresse de livraison</h4>
                <div class="address-info">
                  <i class="material-icons">place</i>
                  <div class="address-text">
                    <div>{{ activeOrder.adresseLivraison.rue }}</div>
                    <div>{{ activeOrder.adresseLivraison.ville }} {{ activeOrder.adresseLivraison.codePostal }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>Montant total</h4>
                <div class="amount-info">
                  <div class="total-amount">{{ activeOrder.montantFinal | currency:'EUR':'symbol':'1.2-2' }}</div>
                  <div class="amount-breakdown">
                    <div>Articles: {{ (activeOrder.montantTotal - activeOrder.fraisLivraison) | currency:'EUR':'symbol':'1.2-2' }}</div>
                    <div>Livraison: {{ activeOrder.fraisLivraison | currency:'EUR':'symbol':'1.2-2' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Articles commandés -->
            <div class="items-section">
              <h4>Articles commandés</h4>
              <div class="items-list">
                <div class="item" *ngFor="let article of activeOrder.articles">
                  <div class="item-info">
                    <div class="item-name">{{ article.nom }}</div>
                    <div class="item-description" *ngIf="article.description">{{ article.description }}</div>
                  </div>
                  <div class="item-quantity">{{ article.quantite }}x</div>
                  <div class="item-price">{{ article.prixTotal | currency:'EUR':'symbol':'1.2-2' }}</div>
                </div>
              </div>
            </div>

            <!-- Instructions spéciales -->
            <div class="instructions-section" *ngIf="activeOrder.instructionsLivraison">
              <h4>Instructions de livraison</h4>
              <div class="instructions-text">
                <i class="material-icons">note</i>
                <span>{{ activeOrder.instructionsLivraison }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="order-actions">
            <button class="action-btn" (click)="trackOnMap()" *ngIf="activeOrder.statut === 'en_cours'">
              <i class="material-icons">map</i>
              Suivre sur la carte
            </button>
            
            <button class="action-btn" (click)="contactSupport()">
              <i class="material-icons">support_agent</i>
              Contacter le support
            </button>

            <button 
              class="action-btn danger" 
              (click)="cancelOrder()" 
              *ngIf="activeOrder.statut === 'nouvelle'"
            >
              <i class="material-icons">cancel</i>
              Annuler la commande
            </button>
          </div>
        </div>

        <!-- Estimation de livraison -->
        <div class="estimation-card glass-card" *ngIf="activeOrder.statut === 'en_cours'">
          <div class="estimation-header">
            <i class="material-icons">schedule</i>
            <h3>Estimation de livraison</h3>
          </div>
          
          <div class="estimation-time">
            <div class="eta-value">{{ getEstimatedDeliveryTime() }}</div>
            <div class="eta-label">Temps estimé restant</div>
          </div>

          <div class="estimation-note">
            <i class="material-icons">info</i>
            <span>Cette estimation peut varier en fonction du trafic et des conditions météo</span>
          </div>
        </div>
      </div>

      <!-- Aucune commande en cours -->
      <ng-template #noActiveOrder>
        <div class="no-order-section glass-card">
          <div class="no-order-icon">
            <i class="material-icons">inbox</i>
          </div>
          
          <h3>Aucune commande en cours</h3>
          
          <p>
            Vous n'avez actuellement aucune commande en cours de livraison.
            Passez une nouvelle commande pour commencer le suivi.
          </p>

          <button class="neon-btn primary">
            <i class="material-icons">add_shopping_cart</i>
            Passer une nouvelle commande
          </button>
        </div>
      </ng-template>

      <!-- Suggestions et informations -->
      <div class="info-section grid grid-3">
        <div class="info-card glass-card">
          <div class="info-icon">
            <i class="material-icons">track_changes</i>
          </div>
          <h4>Suivi en temps réel</h4>
          <p>Suivez votre commande étape par étape jusqu'à la livraison finale</p>
        </div>

        <div class="info-card glass-card">
          <div class="info-icon">
            <i class="material-icons">notifications</i>
          </div>
          <h4>Notifications automatiques</h4>
          <p>Recevez des notifications à chaque étape importante de votre commande</p>
        </div>

        <div class="info-card glass-card">
          <div class="info-icon">
            <i class="material-icons">support</i>
          </div>
          <h4>Support 24h/24</h4>
          <p>Notre équipe support est disponible pour vous aider à tout moment</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suivi-container {
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

    .active-order-section {
      margin-bottom: 3rem;
    }

    .order-card {
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .order-number h3 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-cyan);
      font-family: var(--font-primary);
    }

    .order-time {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .progress-section {
      margin-bottom: 2rem;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--neon-cyan), var(--neon-green));
      border-radius: 2px;
      transition: width 0.8s ease;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
    }

    .step {
      text-align: center;
      flex: 1;
      position: relative;
    }

    .step-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem auto;
      transition: all 0.3s ease;
    }

    .step-icon i {
      font-size: 1.5rem;
      color: var(--text-muted);
    }

    .step.active .step-icon {
      background: rgba(0, 255, 255, 0.2);
      border-color: var(--neon-cyan);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }

    .step.active .step-icon i {
      color: var(--neon-cyan);
    }

    .step.completed .step-icon {
      background: rgba(0, 255, 0, 0.2);
      border-color: var(--neon-green);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }

    .step.completed .step-icon i {
      color: var(--neon-green);
    }

    .step-label {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .step-time {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .order-details {
      margin-bottom: 2rem;
    }

    .details-grid {
      margin-bottom: 2rem;
      gap: 2rem;
    }

    .detail-section h4 {
      color: var(--neon-cyan);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .address-info {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .address-info i {
      color: var(--neon-cyan);
      margin-top: 0.2rem;
    }

    .address-text div {
      color: var(--text-primary);
      line-height: 1.4;
    }

    .amount-info {
      text-align: right;
    }

    .total-amount {
      font-size: 1.8rem;
      font-family: var(--font-primary);
      font-weight: 900;
      color: var(--neon-green);
      margin-bottom: 0.5rem;
    }

    .amount-breakdown {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .amount-breakdown div {
      margin-bottom: 0.25rem;
    }

    .items-section h4 {
      color: var(--neon-cyan);
      margin-bottom: 1rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .item-description {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .item-quantity {
      color: var(--neon-cyan);
      font-weight: 600;
      font-family: var(--font-primary);
    }

    .item-price {
      color: var(--neon-green);
      font-weight: 700;
      font-family: var(--font-primary);
    }

    .instructions-section {
      margin-top: 2rem;
    }

    .instructions-section h4 {
      color: var(--neon-cyan);
      margin-bottom: 1rem;
    }

    .instructions-text {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 136, 0, 0.1);
      border: 1px solid rgba(255, 136, 0, 0.3);
      border-radius: 8px;
    }

    .instructions-text i {
      color: var(--neon-orange);
    }

    .instructions-text span {
      color: var(--text-primary);
      line-height: 1.5;
    }

    .order-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--neon-cyan);
      background: rgba(0, 255, 255, 0.1);
      color: var(--neon-cyan);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .action-btn:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .action-btn.danger {
      border-color: var(--neon-magenta);
      background: rgba(255, 0, 255, 0.1);
      color: var(--neon-magenta);
    }

    .action-btn.danger:hover {
      background: rgba(255, 0, 255, 0.2);
    }

    .estimation-card {
      padding: 2rem;
      text-align: center;
    }

    .estimation-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .estimation-header i {
      color: var(--neon-orange);
      font-size: 1.5rem;
    }

    .estimation-header h3 {
      margin: 0;
      color: var(--text-primary);
    }

    .estimation-time {
      margin-bottom: 1.5rem;
    }

    .eta-value {
      font-size: 2.5rem;
      font-family: var(--font-primary);
      font-weight: 900;
      color: var(--neon-orange);
      line-height: 1;
    }

    .eta-label {
      color: var(--text-secondary);
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.9rem;
    }

    .estimation-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .estimation-note i {
      font-size: 1rem;
    }

    .no-order-section {
      padding: 4rem 2rem;
      text-align: center;
      margin-bottom: 3rem;
    }

    .no-order-icon {
      margin-bottom: 2rem;
    }

    .no-order-icon i {
      font-size: 5rem;
      color: var(--text-muted);
      opacity: 0.5;
    }

    .no-order-section h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .no-order-section p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .info-section {
      gap: 2rem;
    }

    .info-card {
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
    }

    .info-icon {
      margin-bottom: 1.5rem;
    }

    .info-icon i {
      font-size: 3rem;
      color: var(--neon-cyan);
    }

    .info-card h4 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-family: var(--font-primary);
    }

    .info-card p {
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .amount-info {
        text-align: left;
      }

      .progress-steps {
        flex-direction: column;
        gap: 1.5rem;
      }

      .step {
        display: flex;
        align-items: center;
        text-align: left;
        gap: 1rem;
      }

      .step-icon {
        margin: 0;
        width: 50px;
        height: 50px;
      }

      .info-section {
        grid-template-columns: 1fr;
      }

      .order-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .order-card,
      .estimation-card,
      .info-card {
        padding: 1rem;
      }

      .no-order-section {
        padding: 2rem 1rem;
      }

      .eta-value {
        font-size: 2rem;
      }
    }
  `]
})
export class ClientSuiviComponent implements OnInit {
  activeOrder: Commande | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadActiveOrder();
  }

  private loadActiveOrder(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.orderService.getOrdersByClient(currentUser.uid).subscribe(orders => {
        // Trouver la commande active (pas encore livrée)
        this.activeOrder = orders.find(order => 
          order.statut === 'nouvelle' || order.statut === 'en_cours'
        ) || null;
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels = {
      'nouvelle': 'Commande reçue',
      'en_cours': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getProgressPercentage(status: string): number {
    const percentages = {
      'nouvelle': 33,
      'en_cours': 66,
      'livree': 100,
      'annulee': 0
    };
    return percentages[status as keyof typeof percentages] || 0;
  }

  isStepActive(stepStatus: string, currentStatus: string): boolean {
    const statusOrder = ['nouvelle', 'en_cours', 'livree'];
    const stepIndex = statusOrder.indexOf(stepStatus);
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return stepIndex === currentIndex;
  }

  isStepCompleted(stepStatus: string, currentStatus: string): boolean {
    const statusOrder = ['nouvelle', 'en_cours', 'livree'];
    const stepIndex = statusOrder.indexOf(stepStatus);
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return stepIndex < currentIndex;
  }

  formatDateTime(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(timestamp: number): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstimatedDeliveryTime(): string {
    if (!this.activeOrder || !this.activeOrder.dateAcceptation) {
      return '30 min';
    }

    const startTime = this.activeOrder.dateAcceptation;
    const estimatedDuration = 30 * 60 * 1000; // 30 minutes en millisecondes
    const estimatedEnd = startTime + estimatedDuration;
    const now = Date.now();
    
    const remaining = Math.max(0, estimatedEnd - now);
    const remainingMinutes = Math.ceil(remaining / (1000 * 60));
    
    if (remainingMinutes <= 0) {
      return 'Imminent';
    } else if (remainingMinutes === 1) {
      return '1 minute';
    } else {
      return `${remainingMinutes} minutes`;
    }
  }

  trackOnMap(): void {
    // TODO: Implémenter le suivi sur carte
    console.log('Suivi sur carte');
  }

  contactSupport(): void {
    // TODO: Implémenter le contact support
    console.log('Contact support');
  }

  cancelOrder(): void {
    if (this.activeOrder && confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.orderService.updateOrderStatus(this.activeOrder.id, 'annulee').then(success => {
        if (success) {
          this.loadActiveOrder();
        }
      });
    }
  }
}