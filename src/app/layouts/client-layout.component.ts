import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Utilisateur } from '../core/interfaces/utilisateur';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="client-layout">
      <!-- Navigation header -->
      <header class="top-header">
        <div class="header-container">
          <div class="header-left">
            <h1 class="logo">
              <span class="neon-text">LIVRAISON</span>
              <span class="sub-text">EXPRESS</span>
            </h1>
          </div>
          
          <nav class="nav-menu">
            <a routerLink="/client/suivi" 
               routerLinkActive="active" 
               class="nav-item">
              <i class="material-icons">track_changes</i>
              <span>Suivi</span>
            </a>
            
            <a routerLink="/client/historique" 
               routerLinkActive="active" 
               class="nav-item">
              <i class="material-icons">history</i>
              <span>Historique</span>
            </a>
            
            <a routerLink="/client/profil" 
               routerLinkActive="active" 
               class="nav-item">
              <i class="material-icons">person</i>
              <span>Profil</span>
            </a>
          </nav>
          
          <div class="header-right">
            <div class="user-info" *ngIf="currentUser">
              <img [src]="currentUser.photoURL || '/assets/default-avatar.png'" 
                   [alt]="currentUser.prenom" 
                   class="user-avatar">
              <div class="user-details">
                <span class="user-name">{{currentUser.prenom}} {{currentUser.nom}}</span>
                <span class="user-role">Client</span>
              </div>
            </div>
            
            <button (click)="logout()" class="logout-btn neon-btn">
              <i class="material-icons">logout</i>
              <span class="btn-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main content area -->
      <main class="main-content">
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>Support</h3>
              <p>Besoin d'aide ? Contactez-nous 24h/24</p>
              <a href="tel:+33123456789" class="contact-link">
                <i class="material-icons">phone</i>
                01 23 45 67 89
              </a>
            </div>
            
            <div class="footer-section">
              <h3>Livraison</h3>
              <p>Suivez votre commande en temps réel</p>
              <p class="delivery-time">Livraison moyenne: 30 min</p>
            </div>
            
            <div class="footer-section">
              <h3>Zones</h3>
              <p>Service disponible dans toute la région</p>
              <p class="coverage">Couverture 24h/24, 7j/7</p>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2024 Livraison Express. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .client-layout {
      min-height: 100vh;
      background: var(--dark-bg);
      display: flex;
      flex-direction: column;
    }

    .top-header {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      margin: 0;
    }

    .neon-text {
      font-family: var(--font-primary);
      font-size: 1.5rem;
      font-weight: 900;
      background: var(--gradient-neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
      letter-spacing: 2px;
    }

    .sub-text {
      font-family: var(--font-secondary);
      font-size: 0.8rem;
      color: var(--text-secondary);
      letter-spacing: 1px;
      display: block;
      margin-top: 0.1rem;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-family: var(--font-secondary);
      font-weight: 500;
      border: 1px solid transparent;
    }

    .nav-item:hover {
      color: var(--neon-cyan);
      background: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.3);
    }

    .nav-item.active {
      color: var(--neon-cyan);
      background: rgba(0, 255, 255, 0.15);
      border-color: var(--neon-cyan);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }

    .nav-item i {
      font-size: 1.1rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(0, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--neon-cyan);
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9rem;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.25rem;
      font-size: 0.9rem;
    }

    .logout-btn i {
      font-size: 1rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
    }

    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(0, 255, 255, 0.2);
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3 {
      color: var(--neon-cyan);
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer-section p {
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--neon-green);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .contact-link:hover {
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
    }

    .delivery-time,
    .coverage {
      color: var(--neon-green);
      font-weight: 600;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-container {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .nav-menu {
        order: 3;
        width: 100%;
        justify-content: space-around;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.75rem;
        border-radius: 8px;
        margin-top: 1rem;
      }

      .nav-item {
        flex-direction: column;
        padding: 0.5rem;
        gap: 0.25rem;
        flex: 1;
        text-align: center;
      }

      .nav-item span {
        font-size: 0.8rem;
      }

      .header-right {
        order: 2;
        width: 100%;
        justify-content: space-between;
      }

      .user-details {
        display: none;
      }

      .btn-text {
        display: none;
      }

      .content-container {
        padding: 0 1rem;
      }

      .footer-container {
        padding: 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .neon-text {
        font-size: 1.2rem;
      }

      .nav-item i {
        font-size: 1.2rem;
      }

      .nav-item span {
        font-size: 0.7rem;
      }
    }
  `]
})
export class ClientLayoutComponent implements OnInit {
  currentUser: Utilisateur | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}