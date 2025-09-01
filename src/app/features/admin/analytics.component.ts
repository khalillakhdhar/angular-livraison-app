import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <div class="page-header">
        <h2>Analytics & Rapports</h2>
        <p class="subtitle">Analyses détaillées et rapports de performance</p>
      </div>

      <!-- Section en construction -->
      <div class="placeholder-content glass-card">
        <div class="placeholder-icon">
          <i class="material-icons">analytics</i>
        </div>
        
        <h3>Analytics Avancées - En Développement</h3>
        
        <p>
          Les analytics détaillées seront bientôt disponibles avec des fonctionnalités avancées :
        </p>

        <div class="features-grid grid grid-3">
          <div class="feature-card">
            <i class="material-icons">trending_up</i>
            <h4>Tendances</h4>
            <p>Analyse des tendances de commandes, pics d'activité, saisonnalité</p>
          </div>
          
          <div class="feature-card">
            <i class="material-icons">map</i>
            <h4>Géoanalytics</h4>
            <p>Zones de livraison populaires, heatmaps, optimisation des trajets</p>
          </div>
          
          <div class="feature-card">
            <i class="material-icons">speed</i>
            <h4>Performance</h4>
            <p>Temps de livraison, efficacité des livreurs, taux de satisfaction</p>
          </div>
          
          <div class="feature-card">
            <i class="material-icons">attach_money</i>
            <h4>Revenus</h4>
            <p>Analyses financières, rentabilité, prévisions de revenus</p>
          </div>
          
          <div class="feature-card">
            <i class="material-icons">people</i>
            <h4>Clients</h4>
            <p>Comportement client, fidélisation, segmentation</p>
          </div>
          
          <div class="feature-card">
            <i class="material-icons">assessment</i>
            <h4>Rapports</h4>
            <p>Rapports automatiques, exports, tableaux de bord personnalisés</p>
          </div>
        </div>

        <div class="preview-section">
          <h4>Aperçu des Métriques</h4>
          <div class="metrics-preview grid grid-4">
            <div class="metric-item">
              <div class="metric-value">127%</div>
              <div class="metric-label">Croissance mensuelle</div>
              <div class="metric-trend up">
                <i class="material-icons">trending_up</i>
                +23%
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-value">28 min</div>
              <div class="metric-label">Temps moyen livraison</div>
              <div class="metric-trend down">
                <i class="material-icons">trending_down</i>
                -5 min
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-value">4.8/5</div>
              <div class="metric-label">Note moyenne</div>
              <div class="metric-trend up">
                <i class="material-icons">trending_up</i>
                +0.2
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-value">95%</div>
              <div class="metric-label">Taux de réussite</div>
              <div class="metric-trend up">
                <i class="material-icons">trending_up</i>
                +2%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
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

    .placeholder-content {
      padding: 3rem;
      text-align: center;
    }

    .placeholder-icon {
      margin-bottom: 2rem;
    }

    .placeholder-icon i {
      font-size: 5rem;
      color: var(--neon-green);
      animation: pulse 2s ease-in-out infinite;
    }

    .placeholder-content h3 {
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .placeholder-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-grid {
      margin: 3rem 0;
    }

    .feature-card {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      border-color: var(--neon-green);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }

    .feature-card i {
      font-size: 3rem;
      color: var(--neon-green);
      margin-bottom: 1rem;
    }

    .feature-card h4 {
      color: var(--text-primary);
      margin: 0 0 1rem 0;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .feature-card p {
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
      font-size: 0.9rem;
    }

    .preview-section {
      margin-top: 4rem;
      text-align: left;
    }

    .preview-section h4 {
      color: var(--neon-cyan);
      margin-bottom: 2rem;
      text-align: center;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .metrics-preview {
      max-width: 800px;
      margin: 0 auto;
    }

    .metric-item {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      position: relative;
      transition: all 0.3s ease;
    }

    .metric-item:hover {
      border-color: var(--neon-cyan);
      transform: translateY(-3px);
    }

    .metric-value {
      font-size: 2.5rem;
      font-family: var(--font-primary);
      font-weight: 900;
      color: var(--text-primary);
      line-height: 1;
    }

    .metric-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0.5rem 0;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .metric-trend.up {
      color: var(--neon-green);
    }

    .metric-trend.down {
      color: var(--neon-orange);
    }

    .metric-trend i {
      font-size: 1rem;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .placeholder-content {
        padding: 2rem;
      }

      .placeholder-icon i {
        font-size: 4rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .metrics-preview {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .metrics-preview {
        grid-template-columns: 1fr;
      }

      .metric-value {
        font-size: 2rem;
      }
    }
  `]
})
export class AdminAnalyticsComponent {
  // TODO: Implémenter les analytics avancées
}