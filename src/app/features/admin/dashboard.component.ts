import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { OrderService } from '../../core/services/order.service';
import { StatistiquesCommandes } from '../../core/interfaces/commande';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Tableau de bord administrateur</h2>
        <p class="subtitle">Vue d'ensemble de la plateforme de livraison</p>
      </div>

      <!-- KPIs Cards -->
      <div class="kpi-grid grid grid-4">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">shopping_cart</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.totalCommandes || 0 }}</div>
            <div class="stat-label">Total Commandes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <i class="material-icons">today</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats?.commandesJour || 0 }}</div>
            <div class="stat-label">Commandes Aujourd'hui</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <i class="material-icons">euro</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ (stats?.revenusJour || 0) | currency:'EUR':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Revenus du Jour</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <i class="material-icons">star</i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ (stats?.satisfactionClient || 0).toFixed(1) }}/5</div>
            <div class="stat-label">Satisfaction Client</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section grid grid-2">
        <div class="chart-container glass-card">
          <h3>Commandes par jour (7 derniers jours)</h3>
          <canvas #ordersChart width="400" height="200"></canvas>
        </div>

        <div class="chart-container glass-card">
          <h3>Revenus par mois (6 derniers mois)</h3>
          <canvas #revenueChart width="400" height="200"></canvas>
        </div>
      </div>

      <!-- Activity Section -->
      <div class="activity-section">
        <div class="recent-activity glass-card">
          <h3>Activité récente</h3>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivities">
              <div class="activity-icon" [ngClass]="activity.type">
                <i class="material-icons">{{ activity.icon }}</i>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.message }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="active-drivers glass-card">
          <h3>Livreurs actifs</h3>
          <div class="drivers-list">
            <div class="driver-item" *ngFor="let driver of activeDrivers">
              <img [src]="driver.avatar" [alt]="driver.name" class="driver-avatar">
              <div class="driver-info">
                <div class="driver-name">{{ driver.name }}</div>
                <div class="driver-status">{{ driver.status }}</div>
              </div>
              <div class="driver-indicator active"></div>
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
      color: var(--neon-cyan);
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .kpi-grid {
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--neon-cyan);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(0, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neon-cyan);
    }

    .stat-icon.success {
      background: rgba(0, 255, 0, 0.2);
      border-color: var(--neon-green);
    }

    .stat-icon.warning {
      background: rgba(255, 136, 0, 0.2);
      border-color: var(--neon-orange);
    }

    .stat-icon.info {
      background: rgba(255, 255, 0, 0.2);
      border-color: var(--neon-yellow);
    }

    .stat-icon i {
      font-size: 1.8rem;
      color: var(--neon-cyan);
    }

    .stat-icon.success i {
      color: var(--neon-green);
    }

    .stat-icon.warning i {
      color: var(--neon-orange);
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

    .charts-section {
      margin-bottom: 3rem;
    }

    .chart-container {
      padding: 2rem;
    }

    .chart-container h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-cyan);
      font-size: 1.2rem;
    }

    .activity-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .recent-activity,
    .active-drivers {
      padding: 2rem;
    }

    .recent-activity h3,
    .active-drivers h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-cyan);
      font-size: 1.2rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .activity-icon.order {
      background: rgba(0, 255, 255, 0.2);
      color: var(--neon-cyan);
    }

    .activity-icon.delivery {
      background: rgba(0, 255, 0, 0.2);
      color: var(--neon-green);
    }

    .activity-icon.user {
      background: rgba(255, 136, 0, 0.2);
      color: var(--neon-orange);
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      color: var(--text-primary);
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .drivers-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .driver-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .driver-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--neon-green);
      object-fit: cover;
    }

    .driver-info {
      flex: 1;
    }

    .driver-name {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .driver-status {
      color: var(--neon-green);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .driver-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--neon-green);
      box-shadow: 0 0 10px var(--neon-green);
      animation: pulse 2s ease-in-out infinite;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .activity-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .charts-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('ordersChart', { static: false }) ordersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef<HTMLCanvasElement>;

  stats: StatistiquesCommandes | null = null;
  
  recentActivities = [
    {
      type: 'order',
      icon: 'shopping_cart',
      message: 'Nouvelle commande reçue #CMD2024010123',
      time: 'Il y a 5 minutes'
    },
    {
      type: 'delivery',
      icon: 'check_circle',
      message: 'Commande #CMD2024010122 livrée avec succès',
      time: 'Il y a 12 minutes'
    },
    {
      type: 'user',
      icon: 'person_add',
      message: 'Nouveau livreur inscrit: Martin Dupont',
      time: 'Il y a 1 heure'
    },
    {
      type: 'order',
      icon: 'cancel',
      message: 'Commande #CMD2024010121 annulée',
      time: 'Il y a 2 heures'
    }
  ];

  activeDrivers = [
    {
      name: 'Pierre Martin',
      status: 'En livraison',
      avatar: '/assets/default-avatar.png'
    },
    {
      name: 'Sophie Durand',
      status: 'Disponible',
      avatar: '/assets/default-avatar.png'
    },
    {
      name: 'Thomas Leroy',
      status: 'En livraison',
      avatar: '/assets/default-avatar.png'
    }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  private async loadStatistics(): Promise<void> {
    try {
      this.stats = await this.orderService.getOrdersStatistics();
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  }

  private initializeCharts(): void {
    this.createOrdersChart();
    this.createRevenueChart();
  }

  private createOrdersChart(): void {
    const ctx = this.ordersChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Commandes',
            data: [12, 19, 3, 5, 2, 3, 8],
            borderColor: '#00ffff',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff',
                font: {
                  family: 'Rajdhani'
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#b0b0b0',
                font: {
                  family: 'Rajdhani'
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              ticks: {
                color: '#b0b0b0',
                font: {
                  family: 'Rajdhani'
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }
  }

  private createRevenueChart(): void {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Août', 'Sept', 'Oct', 'Nov', 'Déc', 'Jan'],
          datasets: [{
            label: 'Revenus (€)',
            data: [1200, 1900, 800, 1500, 2000, 2300],
            backgroundColor: [
              'rgba(0, 255, 255, 0.3)',
              'rgba(0, 255, 0, 0.3)',
              'rgba(255, 0, 255, 0.3)',
              'rgba(255, 255, 0, 0.3)',
              'rgba(255, 136, 0, 0.3)',
              'rgba(0, 255, 255, 0.3)'
            ],
            borderColor: [
              '#00ffff',
              '#00ff00',
              '#ff00ff',
              '#ffff00',
              '#ff8800',
              '#00ffff'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff',
                font: {
                  family: 'Rajdhani'
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#b0b0b0',
                font: {
                  family: 'Rajdhani'
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              ticks: {
                color: '#b0b0b0',
                font: {
                  family: 'Rajdhani'
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }
  }
}