import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-wrapper">
        <mat-card class="login-card">
          <mat-card-header>
            <mat-card-title>Connexion Admin</mat-card-title>
            <mat-card-subtitle>Application de livraison</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required>
                <mat-icon matSuffix>email</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mot de passe</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
                <mat-icon matSuffix (click)="hidePassword = !hidePassword">
                  {{hidePassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
              </mat-form-field>
              
              <div class="button-group">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="loginForm.invalid || isLoading" class="full-width">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <span *ngIf="!isLoading">Se connecter</span>
                </button>
                
                <div class="divider">ou</div>
                
                <button mat-stroked-button type="button" (click)="loginWithGoogle()" 
                        [disabled]="isLoading" class="full-width google-btn">
                  <mat-icon>account_circle</mat-icon>
                  Continuer avec Google
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card-wrapper {
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .divider {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    .google-btn {
      color: #4285f4;
      border-color: #4285f4;
    }

    mat-card-header {
      text-align: center;
      color: white;
    }

    mat-card-title {
      font-size: 28px;
      font-weight: 300;
    }

    mat-card-subtitle {
      font-size: 16px;
      opacity: 0.8;
    }

    ::ng-deep .mat-mdc-form-field {
      .mat-mdc-text-field-wrapper {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      
      .mat-mdc-form-field-label {
        color: rgba(255, 255, 255, 0.8) !important;
      }
      
      .mat-mdc-input-element {
        color: white;
      }
    }

    ::ng-deep .mat-mdc-raised-button.mat-primary {
      background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
      border: none;
      border-radius: 25px;
      height: 48px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      try {
        const user = await this.authService.loginWithEmail(email, password);
        
        // Redirect based on role
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'livreur') {
          this.router.navigate(['/livreur']);
        } else {
          this.router.navigate(['/client']);
        }
        
        this.snackBar.open('Connexion réussie!', 'Fermer', { duration: 3000 });
      } catch (error: any) {
        this.snackBar.open(
          error.message || 'Erreur de connexion', 
          'Fermer', 
          { duration: 5000 }
        );
      } finally {
        this.isLoading = false;
      }
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    
    try {
      const user = await this.authService.loginWithGoogle();
      
      // Redirect based on role
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (user.role === 'livreur') {
        this.router.navigate(['/livreur']);
      } else {
        this.router.navigate(['/client']);
      }
      
      this.snackBar.open('Connexion réussie!', 'Fermer', { duration: 3000 });
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Erreur de connexion avec Google', 
        'Fermer', 
        { duration: 5000 }
      );
    } finally {
      this.isLoading = false;
    }
  }
}