import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-background">
        <div class="bg-pattern"></div>
      </div>
      
      <div class="auth-card glass-card">
        <div class="auth-header">
          <h1 class="auth-title">Inscription</h1>
          <p class="auth-subtitle">Créez votre compte livraison</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="prenom" class="form-label">Prénom</label>
              <input
                type="text"
                id="prenom"
                formControlName="prenom"
                class="futuristic-input"
                placeholder="John"
                [class.error]="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched"
              >
            </div>

            <div class="form-group">
              <label for="nom" class="form-label">Nom</label>
              <input
                type="text"
                id="nom"
                formControlName="nom"
                class="futuristic-input"
                placeholder="Doe"
                [class.error]="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="futuristic-input"
              placeholder="john.doe@email.com"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="telephone" class="form-label">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              formControlName="telephone"
              class="futuristic-input"
              placeholder="+33 6 12 34 56 78"
            >
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Type de compte</label>
            <select
              id="role"
              formControlName="role"
              class="futuristic-input"
            >
              <option value="client">Client</option>
              <option value="livreur">Livreur</option>
            </select>
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
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
              >
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="futuristic-input"
              placeholder="••••••••"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            >
            <div class="error-message" *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
              Les mots de passe ne correspondent pas
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="neon-btn primary"
              [disabled]="registerForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Créer mon compte</span>
              <span *ngIf="isLoading" class="loading-text">
                <div class="loading-spinner"></div>
                Création...
              </span>
            </button>
          </div>
        </form>

        <div class="auth-links">
          <div class="signin-link">
            <span>Déjà un compte ?</span>
            <a routerLink="/auth/connexion" class="link primary">Se connecter</a>
          </div>
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
        radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
      animation: bgShift 20s ease-in-out infinite;
    }

    @keyframes bgShift {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(1deg); }
    }

    .auth-card {
      width: 100%;
      max-width: 500px;
      padding: 2.5rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      color: var(--neon-green);
      text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }

    .auth-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
      color: var(--neon-green);
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

    select.futuristic-input {
      cursor: pointer;
    }

    .form-actions {
      margin-top: 2rem;
    }

    .neon-btn.primary {
      width: 100%;
      background: linear-gradient(45deg, var(--neon-green), var(--neon-cyan));
      border: none;
      color: var(--dark-bg);
      font-weight: 700;
    }

    .neon-btn.primary:hover {
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }

    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .auth-links {
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1.5rem;
      margin-top: 2rem;
    }

    .link {
      color: var(--neon-green);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .link:hover {
      text-shadow: 0 0 10px var(--neon-green);
    }

    .signin-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-secondary);
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

      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
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

      .signin-link {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `]
})
export class InscriptionComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      role: ['client', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      try {
        await this.authService.register(userData, userData.password);
      } finally {
        this.isLoading = false;
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}