import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  connexionForm: FormGroup;
  chargement = false;
  erreur = '';

  constructor() {
    this.connexionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]]
    });
  }

  get email() { return this.connexionForm.get('email'); }
  get motDePasse() { return this.connexionForm.get('motDePasse'); }

  async seConnecter() {
    if (this.connexionForm.invalid) return;

    this.chargement = true;
    this.erreur = '';

    try {
      const utilisateur = await this.authService.connecterAvecEmail(this.connexionForm.value);
      await this.redirigerSelonRole(utilisateur.role);
    } catch (error: any) {
      this.erreur = error.message;
    } finally {
      this.chargement = false;
    }
  }

  async connecterAvecGoogle() {
    this.chargement = true;
    this.erreur = '';

    try {
      const utilisateur = await this.authService.connecterAvecGoogle();
      await this.redirigerSelonRole(utilisateur.role);
    } catch (error: any) {
      this.erreur = error.message;
    } finally {
      this.chargement = false;
    }
  }

  private async redirigerSelonRole(role: string) {
    switch (role) {
      case 'admin':
        await this.router.navigate(['/admin/dashboard']);
        break;
      case 'livreur':
        await this.router.navigate(['/livreur/dashboard']);
        break;
      case 'client':
        await this.router.navigate(['/client/suivi']);
        break;
      default:
        await this.router.navigate(['/client/suivi']);
    }
  }
}