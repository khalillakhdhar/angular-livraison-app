import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-livreurs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="livreurs-container">
      <div class="page-header">
        <h2>Gestion des Livreurs</h2>
        <p class="subtitle">Administration et suivi des livreurs</p>
      </div>

      <!-- Section en construction -->
      <div class="placeholder-content glass-card">
        <div class="placeholder-icon">
          <i class="material-icons">construction</i>
        </div>
        
        <h3>Fonctionnalité en développement</h3>
        
        <p>
          La gestion des livreurs sera bientôt disponible avec les fonctionnalités suivantes :
        </p>

        <div class="features-list">
          <div class="feature-item">
            <i class="material-icons">person_add</i>
            <span>Inscription et validation des nouveaux livreurs</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">assignment_ind</i>
            <span>Gestion des profils et documents</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">location_on</i>
            <span>Suivi en temps réel des positions</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">assessment</i>
            <span>Statistiques de performance</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">star</i>
            <span>Système d'évaluation</span>
          </div>
          <div class="feature-item">
            <i class="material-icons">payment</i>
            <span>Gestion des paiements</span>
          </div>
        </div>

        <div class="mock-stats grid grid-3">
          <div class="stat-card">
            <div class="stat-value text-success">8</div>
            <div class="stat-label">Livreurs Actifs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value text-neon">3</div>
            <div class="stat-label">En Service</div>
          </div>
          <div class="stat-card">
            <div class="stat-value text-warning">2</div>
            <div class="stat-label">Demandes Pendantes</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .livreurs-container {
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
      color: var(--neon-cyan);
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
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: var(--neon-cyan);
    }

    .feature-item i {
      color: var(--neon-cyan);
      font-size: 1.5rem;
    }

    .feature-item span {
      color: var(--text-primary);
      font-weight: 500;
    }

    .mock-stats {
      margin-top: 3rem;
    }

    .stat-card {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
    }

    .stat-value {
      font-size: 3rem;
      font-family: var(--font-primary);
      font-weight: 900;
      line-height: 1;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0.5rem;
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
    @media (max-width: 768px) {
      .placeholder-content {
        padding: 2rem;
      }

      .placeholder-icon i {
        font-size: 4rem;
      }

      .features-list {
        grid-template-columns: 1fr;
      }

      .mock-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminLivreursComponent {
  // TODO: Implémenter la gestion des livreurs
}