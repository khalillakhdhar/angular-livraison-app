import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Utilisateur } from '../core/interfaces/utilisateur';

@Component({
  selector: 'app-livreur-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="livreur-layout">
      <!-- Navigation sidebar -->
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2 class="logo">
            <span class="neon-text">LIVREUR</span>
            <span class="sub-text">PANEL</span>
          </h2>
        </div>

        <div class="nav-menu">
          <a routerLink="/livreur/dashboard" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">dashboard</i>
            <span>Tableau de bord</span>
          </a>
          
          <a routerLink="/livreur/livraisons" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">local_shipping</i>
            <span>Mes livraisons</span>
          </a>
          
          <a routerLink="/livreur/carte" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">map</i>
            <span>Carte</span>
          </a>
          
          <a routerLink="/livreur/profil" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">person</i>
            <span>Profil</span>
          </a>
        </div>

        <div class="status-section">
          <div class="availability-toggle">
            <label class="toggle-label">
              <input type="checkbox" [checked]="isAvailable" (change)="toggleAvailability()">
              <span class="toggle-slider"></span>
              <span class="toggle-text">{{ isAvailable ? 'Disponible' : 'Indisponible' }}</span>
            </label>
          </div>
        </div>
      </nav>

      <!-- Main content area -->
      <div class="main-content">
        <!-- Top header -->
        <header class="top-header">
          <div class="header-left">
            <h1 class="page-title">Espace Livreur</h1>
            <div class="status-indicator" [class.available]="isAvailable" [class.unavailable]="!isAvailable">
              <span class="status-dot"></span>
              <span class="status-text">{{ isAvailable ? 'En service' : 'Hors service' }}</span>
            </div>
          </div>
          
          <div class="header-right">
            <div class="user-info" *ngIf="currentUser">
              <img [src]="currentUser.photoURL || '/assets/default-avatar.png'" 
                   [alt]="currentUser.prenom" 
                   class="user-avatar">
              <div class="user-details">
                <span class="user-name">{{currentUser.prenom}} {{currentUser.nom}}</span>
                <span class="user-role">Livreur</span>
              </div>
            </div>
            
            <button (click)="logout()" class="logout-btn neon-btn">
              <i class="material-icons">logout</i>
              Déconnexion
            </button>
          </div>
        </header>

        <!-- Page content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .livreur-layout {
      display: flex;
      min-height: 100vh;
      background: var(--dark-bg);
    }

    .sidebar {
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(0, 255, 0, 0.2);
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    }

    .logo {
      margin: 0;
      text-align: center;
    }

    .neon-text {
      font-family: var(--font-primary);
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--neon-green);
      text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      display: block;
      letter-spacing: 3px;
    }

    .sub-text {
      font-family: var(--font-secondary);
      font-size: 0.9rem;
      color: var(--text-secondary);
      letter-spacing: 2px;
      display: block;
      margin-top: 0.25rem;
    }

    .nav-menu {
      padding: 1rem 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      font-family: var(--font-secondary);
      font-weight: 500;
    }

    .nav-item:hover {
      color: var(--neon-green);
      background: rgba(0, 255, 0, 0.1);
      border-left-color: var(--neon-green);
    }

    .nav-item.active {
      color: var(--neon-green);
      background: rgba(0, 255, 0, 0.15);
      border-left-color: var(--neon-green);
      box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1);
    }

    .nav-item i {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }

    .status-section {
      padding: 1.5rem;
      border-top: 1px solid rgba(0, 255, 0, 0.2);
    }

    .availability-toggle {
      text-align: center;
    }

    .toggle-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .toggle-label input {
      display: none;
    }

    .toggle-slider {
      width: 60px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      position: relative;
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 255, 0, 0.3);
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--text-muted);
      top: 2px;
      left: 2px;
      transition: all 0.3s ease;
    }

    input:checked + .toggle-slider {
      background: rgba(0, 255, 0, 0.3);
      border-color: var(--neon-green);
    }

    input:checked + .toggle-slider::before {
      background: var(--neon-green);
      transform: translateX(30px);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    }

    .toggle-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    input:checked ~ .toggle-text {
      color: var(--neon-green);
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
    }

    .top-header {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 255, 0, 0.2);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      color: var(--neon-green);
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .status-indicator.available {
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid var(--neon-green);
      color: var(--neon-green);
    }

    .status-indicator.unavailable {
      background: rgba(255, 0, 255, 0.2);
      border: 1px solid var(--neon-magenta);
      color: var(--neon-magenta);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .available .status-dot {
      background: var(--neon-green);
      box-shadow: 0 0 10px var(--neon-green);
    }

    .unavailable .status-dot {
      background: var(--neon-magenta);
      box-shadow: 0 0 10px var(--neon-magenta);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
      background: rgba(0, 255, 0, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(0, 255, 0, 0.2);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--neon-green);
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
      font-size: 0.8rem;
      color: var(--neon-green);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      border-color: var(--neon-green);
      color: var(--neon-green);
    }

    .logout-btn:hover {
      box-shadow: 0 0 20px var(--neon-green);
    }

    .logout-btn i {
      font-size: 1.1rem;
    }

    .page-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 250px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .main-content {
        margin-left: 0;
      }

      .top-header {
        padding: 1rem;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .header-left,
      .header-right {
        justify-content: space-between;
      }

      .page-title {
        font-size: 1.2rem;
      }

      .user-details {
        display: none;
      }

      .page-content {
        padding: 1rem;
      }
    }
  `]
})
export class LivreurLayoutComponent implements OnInit {
  currentUser: Utilisateur | null = null;
  isAvailable: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // TODO: Récupérer le statut de disponibilité depuis Firestore
    });
  }

  toggleAvailability(): void {
    this.isAvailable = !this.isAvailable;
    // TODO: Mettre à jour le statut dans Firestore
  }

  logout(): void {
    this.authService.signOut();
  }
}