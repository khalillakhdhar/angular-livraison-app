import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { Utilisateur } from '../../../core/models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="side" opened>
        <div class="sidenav-header">
          <div class="logo">
            <mat-icon class="logo-icon">local_shipping</mat-icon>
            <span class="logo-text">LivraisonApp</span>
          </div>
        </div>
        
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          
          <a mat-list-item routerLink="/admin/utilisateurs" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Utilisateurs</span>
          </a>
          
          <a mat-list-item routerLink="/admin/commandes" routerLinkActive="active">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            <span matListItemTitle>Commandes</span>
          </a>
          
          <a mat-list-item routerLink="/admin/livreurs" routerLinkActive="active">
            <mat-icon matListItemIcon>delivery_dining</mat-icon>
            <span matListItemTitle>Livreurs</span>
          </a>
          
          <a mat-list-item routerLink="/admin/sorties" routerLinkActive="active">
            <mat-icon matListItemIcon>route</mat-icon>
            <span matListItemTitle>Sorties</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <a mat-list-item routerLink="/admin/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Paramètres</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content class="main-content">
        <!-- Top toolbar -->
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="drawer.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-spacer"></span>
          
          <!-- Notifications -->
          <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
            <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
          </button>
          
          <!-- User menu -->
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-avatar">
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>

        <!-- Page content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <!-- Notification menu -->
    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="menu-header">
        <h3>Notifications</h3>
      </div>
      <button mat-menu-item>
        <mat-icon>info</mat-icon>
        <span>Nouvelle commande reçue</span>
      </button>
      <button mat-menu-item>
        <mat-icon>warning</mat-icon>
        <span>Livraison en retard</span>
      </button>
      <button mat-menu-item>
        <mat-icon>check_circle</mat-icon>
        <span>Livraison terminée</span>
      </button>
    </mat-menu>

    <!-- User menu -->
    <mat-menu #userMenu="matMenu" class="user-menu">
      <div class="user-info" *ngIf="currentUser">
        <div class="user-name">{{currentUser.prenom}} {{currentUser.nom}}</div>
        <div class="user-role">{{currentUser.role | titlecase}}</div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/admin/profile">
        <mat-icon>person</mat-icon>
        <span>Mon profil</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Déconnexion</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: #f5f5f5;
    }

    .sidenav {
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-right: none;
    }

    .sidenav-header {
      padding: 24px 16px;
      background: rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .nav-list {
      padding-top: 16px;
    }

    .nav-list a {
      color: rgba(255, 255, 255, 0.9);
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-list a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-list a.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }

    .toolbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .menu-button {
      display: none;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-avatar {
      margin-left: 8px;
    }

    .page-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: #f8f9fa;
    }

    .menu-header {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .menu-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-name {
      font-weight: 500;
      font-size: 16px;
    }

    .user-role {
      font-size: 14px;
      color: #666;
      text-transform: capitalize;
    }

    .notification-menu,
    .user-menu {
      min-width: 250px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
        max-width: 280px;
      }

      .menu-button {
        display: block;
      }

      .page-content {
        padding: 16px;
      }
    }

    /* Glass morphism effects */
    ::ng-deep .mat-mdc-menu-panel {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95) !important;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  currentUser: Utilisateur | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}