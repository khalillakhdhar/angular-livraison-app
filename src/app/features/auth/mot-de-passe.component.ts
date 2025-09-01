import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mot-de-passe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-background">
        <div class="bg-pattern"></div>
      </div>
      
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1 class="auth-title">Mot de passe oublié</h1>
          <p class="auth-subtitle">Récupération de compte - Fonctionnalité à venir</p>
        </div>

        <div class="placeholder-content">
          <div class="placeholder-icon">
            <i class="material-icons">construction</i>
          </div>
          
          <h3>Fonctionnalité en développement</h3>
          
          <p>
            La récupération de mot de passe sera disponible prochainement.
            En attendant, contactez l'administrateur pour réinitialiser votre compte.
          </p>

          <div class="contact-info">
            <div class="contact-item">
              <i class="material-icons">email</i>
              <span>support@livraison-express.fr</span>
            </div>
            <div class="contact-item">
              <i class="material-icons">phone</i>
              <span>01 23 45 67 89</span>
            </div>
          </div>
        </div>

        <div class="auth-links">
          <a routerLink="/auth/connexion" class="link primary">
            <i class="material-icons">arrow_back</i>
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .auth-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .bg-pattern {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 30% 70%, rgba(255, 136, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
      animation: bgShift 15s ease-in-out infinite;
    }

    @keyframes bgShift {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 2.5rem;
      animation: fadeInUp 0.8s ease-out;
      text-align: center;
    }

    .auth-header {
      margin-bottom: 2rem;
    }

    .auth-title {
      margin: 0 0 0.5rem 0;
      font-size: 2.2rem;
      color: var(--neon-orange);
      text-shadow: 0 0 20px rgba(255, 136, 0, 0.5);
    }

    .auth-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .placeholder-content {
      margin-bottom: 2rem;
    }

    .placeholder-icon {
      margin-bottom: 1.5rem;
    }

    .placeholder-icon i {
      font-size: 4rem;
      color: var(--neon-orange);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }

    .placeholder-content h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .placeholder-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: rgba(255, 136, 0, 0.1);
      border: 1px solid rgba(255, 136, 0, 0.3);
      border-radius: 8px;
      padding: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .contact-item i {
      color: var(--neon-orange);
      font-size: 1.2rem;
    }

    .auth-links {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1.5rem;
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--neon-cyan);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: 1px solid rgba(0, 255, 255, 0.3);
    }

    .link:hover {
      background: rgba(0, 255, 255, 0.1);
      text-shadow: 0 0 10px var(--neon-cyan);
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .auth-container {
        padding: 1rem;
      }

      .auth-card {
        max-width: 100%;
        padding: 2rem;
      }

      .auth-title {
        font-size: 1.8rem;
      }

      .placeholder-icon i {
        font-size: 3rem;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .auth-title {
        font-size: 1.6rem;
      }

      .contact-info {
        padding: 1rem;
      }

      .contact-item {
        font-size: 0.9rem;
      }
    }
  `]
})
export class MotDePasseComponent {
  // TODO: Implémenter la réinitialisation du mot de passe
  // avec sendPasswordResetEmail de Firebase Auth
}