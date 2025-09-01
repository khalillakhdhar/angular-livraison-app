import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <!-- Loading overlay si nécessaire -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement...</p>
      </div>
      
      <!-- Contenu principal -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: var(--dark-bg);
      position: relative;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loading-text {
      color: var(--neon-cyan);
      font-family: var(--font-primary);
      font-size: 1.2rem;
      margin-top: 1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: neonPulse 2s ease-in-out infinite;
    }

    @keyframes neonPulse {
      0%, 100% {
        text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      }
      50% {
        text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Livraison Futuriste';
  isLoading = true;
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Attendre que l'état d'authentification soit initialisé
    const authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      // Petit délai pour s'assurer que tout est chargé
      setTimeout(() => {
        this.isLoading = false;
        
        // Si pas connecté et pas sur une page d'auth, rediriger vers connexion
        if (!isAuth && !this.router.url.startsWith('/auth')) {
          this.router.navigate(['/auth/connexion']);
        }
      }, 1000);
    });

    this.subscription.add(authSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}