import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Utilisateur } from '../core/interfaces/utilisateur';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Navigation sidebar -->
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2 class="logo">
            <span class="neon-text">ADMIN</span>
            <span class="sub-text">PANEL</span>
          </h2>
        </div>

        <div class="nav-menu">
          <a routerLink="/admin/dashboard" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">dashboard</i>
            <span>Tableau de bord</span>
          </a>
          
          <a routerLink="/admin/commandes" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">shopping_cart</i>
            <span>Commandes</span>
          </a>
          
          <a routerLink="/admin/livreurs" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">delivery_dining</i>
            <span>Livreurs</span>
          </a>
          
          <a routerLink="/admin/analytics" 
             routerLinkActive="active" 
             class="nav-item">
            <i class="material-icons">analytics</i>
            <span>Analytics</span>
          </a>
        </div>
      </nav>

      <!-- Main content area -->
      <div class="main-content">
        <!-- Top header -->
        <header class="top-header">
          <div class="header-left">
            <h1 class="page-title">Administration</h1>
          </div>
          
          <div class="header-right">
            <div class="user-info" *ngIf="currentUser">
              <img [src]="currentUser.photoURL || '/assets/default-avatar.png'" 
                   [alt]="currentUser.prenom" 
                   class="user-avatar">
              <div class="user-details">
                <span class="user-name">{{currentUser.prenom}} {{currentUser.nom}}</span>
                <span class="user-role">Administrateur</span>
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
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: var(--dark-bg);
    }

    .sidebar {
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(0, 255, 255, 0.2);
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    }

    .logo {
      margin: 0;
      text-align: center;
    }

    .neon-text {
      font-family: var(--font-primary);
      font-size: 1.8rem;
      font-weight: 900;
      background: var(--gradient-neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
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
      color: var(--neon-cyan);
      background: rgba(0, 255, 255, 0.1);
      border-left-color: var(--neon-cyan);
    }

    .nav-item.active {
      color: var(--neon-cyan);
      background: rgba(0, 255, 255, 0.15);
      border-left-color: var(--neon-cyan);
      box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.1);
    }

    .nav-item i {
      margin-right: 0.75rem;
      font-size: 1.2rem;
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
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      color: var(--neon-cyan);
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 2px;
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
      width: 40px;
      height: 40px;
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
      font-size: 0.8rem;
      color: var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
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
      }

      .page-title {
        font-size: 1.2rem;
      }

      .user-info {
        padding: 0.5rem;
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
export class AdminLayoutComponent implements OnInit {
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