import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-background">
        <div class="bg-pattern"></div>
        <div class="bg-glow"></div>
      </div>
      
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1 class="auth-title">Connexion</h1>
          <p class="auth-subtitle">Accédez à votre espace livraison</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="futuristic-input"
              placeholder="votre@email.com"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Email requis et valide
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <div class="password-input-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="futuristic-input"
                placeholder="••••••••"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
              >
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Mot de passe requis (min. 6 caractères)
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="neon-btn primary"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading" class="loading-text">
                <div class="loading-spinner"></div>
                Connexion...
              </span>
            </button>

            <div class="divider">
              <span>ou</span>
            </div>

            <button
              type="button"
              class="neon-btn google"
              (click)="signInWithGoogle()"
              [disabled]="isLoading"
            >
              <img src="/assets/google-icon.png" alt="Google" class="google-icon">
              Continuer avec Google
            </button>
          </div>
        </form>

        <div class="auth-links">
          <a routerLink="/auth/mot-de-passe" class="link">Mot de passe oublié ?</a>
          <div class="signup-link">
            <span>Pas encore de compte ?</span>
            <a routerLink="/auth/inscription" class="link primary">S'inscrire</a>
          </div>
        </div>
      </div>

      <div class="auth-info">
        <div class="info-card glass-card">
          <h3>Plateforme de livraison nouvelle génération</h3>
          <ul>
            <li>✨ Suivi en temps réel</li>
            <li>🚀 Livraison express</li>
            <li>🎯 Géolocalisation précise</li>
            <li>🔒 Sécurité maximale</li>
          </ul>
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
      gap: 3rem;
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
        radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);
      animation: bgShift 20s ease-in-out infinite;
    }

    .bg-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.05), transparent),
        linear-gradient(-45deg, transparent, rgba(255, 0, 255, 0.05), transparent);
    }

    @keyframes bgShift {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(-20px) translateY(-20px); }
      50% { transform: translateX(20px) translateY(-20px); }
      75% { transform: translateX(-20px) translateY(20px); }
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      animation: slideInLeft 0.8s ease-out;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      background: var(--gradient-neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .auth-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .password-toggle:hover {
      color: var(--neon-cyan);
    }

    .error-message {
      color: var(--neon-magenta);
      font-size: 0.8rem;
      margin-top: 0.5rem;
      animation: fadeInUp 0.3s ease-out;
    }

    .futuristic-input.error {
      border-color: var(--neon-magenta);
      box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .neon-btn.primary {
      background: var(--gradient-neon);
      border: none;
      color: var(--dark-bg);
      font-weight: 700;
    }

    .neon-btn.primary:hover {
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .neon-btn.google {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .loading-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .divider {
      text-align: center;
      position: relative;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    }

    .divider span {
      background: var(--dark-bg);
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .auth-links {
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1.5rem;
    }

    .link {
      color: var(--neon-cyan);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .link:hover {
      text-shadow: 0 0 10px var(--neon-cyan);
    }

    .link.primary {
      color: var(--neon-green);
    }

    .link.primary:hover {
      text-shadow: 0 0 10px var(--neon-green);
    }

    .signup-link {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-secondary);
    }

    .auth-info {
      width: 100%;
      max-width: 350px;
      animation: slideInRight 0.8s ease-out;
    }

    .info-card {
      padding: 2rem;
    }

    .info-card h3 {
      color: var(--neon-cyan);
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card li {
      padding: 0.75rem 0;
      color: var(--text-secondary);
      font-weight: 500;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-card li:last-child {
      border-bottom: none;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column;
        padding: 1rem;
        gap: 2rem;
      }

      .auth-card {
        max-width: 100%;
        padding: 2rem;
      }

      .auth-info {
        max-width: 100%;
      }

      .auth-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .auth-title {
        font-size: 1.75rem;
      }

      .signup-link {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `]
})
export class ConnexionComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const { email, password } = this.loginForm.value;
      
      try {
        await this.authService.signInWithEmail(email, password);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async signInWithGoogle(): Promise<void> {
    if (!this.isLoading) {
      this.isLoading = true;
      
      try {
        await this.authService.signInWithGoogle();
      } finally {
        this.isLoading = false;
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}