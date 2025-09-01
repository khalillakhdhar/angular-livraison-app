import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Utilisateur } from '../../core/interfaces/utilisateur';

@Component({
  selector: 'app-livreur-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profil-container">
      <div class="page-header">
        <h2>Mon Profil</h2>
        <p class="subtitle">Informations personnelles et véhicule</p>
      </div>

      <div class="profil-content grid grid-2">
        <!-- Informations personnelles -->
        <div class="personal-info glass-card">
          <h3>Informations Personnelles</h3>
          
          <form [formGroup]="profilForm" class="profil-form">
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                formControlName="prenom"
                class="futuristic-input"
                readonly
              >
            </div>

            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                type="text"
                id="nom"
                formControlName="nom"
                class="futuristic-input"
                readonly
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="futuristic-input"
                readonly
              >
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                formControlName="telephone"
                class="futuristic-input"
                [readonly]="!isEditing"
              >
            </div>

            <div class="form-group">
              <label for="adresse">Adresse</label>
              <textarea
                id="adresse"
                formControlName="adresse"
                class="futuristic-input"
                rows="3"
                [readonly]="!isEditing"
              ></textarea>
            </div>

            <div class="form-actions" *ngIf="isEditing">
              <button type="button" class="neon-btn success" (click)="saveProfile()">
                <i class="material-icons">save</i>
                Sauvegarder
              </button>
              <button type="button" class="neon-btn" (click)="cancelEdit()">
                <i class="material-icons">cancel</i>
                Annuler
              </button>
            </div>
          </form>

          <div class="edit-button" *ngIf="!isEditing">
            <button class="neon-btn" (click)="enableEdit()">
              <i class="material-icons">edit</i>
              Modifier les informations
            </button>
          </div>
        </div>

        <!-- Informations véhicule -->
        <div class="vehicle-info glass-card">
          <h3>Mon Véhicule</h3>
          
          <div class="vehicle-placeholder">
            <div class="placeholder-icon">
              <i class="material-icons">directions_bike</i>
            </div>
            
            <h4>Informations Véhicule</h4>
            
            <p>
              Cette section permettra de gérer les informations de votre véhicule de livraison.
            </p>

            <div class="vehicle-features">
              <div class="feature-item">
                <i class="material-icons">directions_car</i>
                <span>Type de véhicule</span>
              </div>
              <div class="feature-item">
                <i class="material-icons">description</i>
                <span>Informations techniques</span>
              </div>
              <div class="feature-item">
                <i class="material-icons">verified</i>
                <span>Documents et assurance</span>
              </div>
              <div class="feature-item">
                <i class="material-icons">location_on</i>
                <span>Zone de livraison</span>
              </div>
            </div>

            <button class="neon-btn">
              <i class="material-icons">add</i>
              Ajouter un véhicule
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-section glass-card">
        <h3>Mes Statistiques</h3>
        
        <div class="stats-grid grid grid-4">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="material-icons">local_shipping</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">247</div>
              <div class="stat-label">Livraisons Total</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon success">
              <i class="material-icons">star</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">4.8/5</div>
              <div class="stat-label">Note Moyenne</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon warning">
              <i class="material-icons">schedule</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">22 min</div>
              <div class="stat-label">Temps Moyen</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon info">
              <i class="material-icons">timeline</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">98.5%</div>
              <div class="stat-label">Taux de Réussite</div>
            </div>
          </div>
        </div>

        <div class="performance-chart">
          <h4>Performance des 30 derniers jours</h4>
          <div class="chart-placeholder">
            <i class="material-icons">show_chart</i>
            <p>Graphique de performance à venir</p>
          </div>
        </div>
      </div>

      <!-- Paramètres -->
      <div class="settings-section glass-card">
        <h3>Paramètres</h3>
        
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Notifications Push</div>
              <div class="setting-desc">Recevoir des notifications pour les nouvelles commandes</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Mode Sombre</div>
              <div class="setting-desc">Interface sombre pour un confort visuel optimal</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Géolocalisation Automatique</div>
              <div class="setting-desc">Activer le suivi automatique de position</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Emails de Rapport</div>
              <div class="setting-desc">Recevoir un rapport hebdomadaire par email</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profil-container {
      animation: fadeInUp 0.6s ease-out;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-green);
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .profil-content {
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .personal-info,
    .vehicle-info,
    .stats-section,
    .settings-section {
      padding: 2rem;
    }

    .personal-info h3,
    .vehicle-info h3,
    .stats-section h3,
    .settings-section h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-green);
      font-size: 1.2rem;
    }

    .profil-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .futuristic-input[readonly] {
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .edit-button {
      margin-top: 1.5rem;
    }

    .vehicle-placeholder {
      text-align: center;
      padding: 2rem;
    }

    .placeholder-icon {
      margin-bottom: 1.5rem;
    }

    .placeholder-icon i {
      font-size: 4rem;
      color: var(--neon-green);
      animation: pulse 2s ease-in-out infinite;
    }

    .vehicle-placeholder h4 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-family: var(--font-primary);
    }

    .vehicle-placeholder p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .vehicle-features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 6px;
    }

    .feature-item i {
      color: var(--neon-green);
    }

    .feature-item span {
      color: var(--text-primary);
      font-weight: 500;
    }

    .stats-section {
      grid-column: 1 / -1;
    }

    .stats-grid {
      margin-bottom: 2rem;
    }

    .stat-item {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: rgba(0, 255, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neon-green);
    }

    .stat-icon i {
      font-size: 1.5rem;
      color: var(--neon-green);
    }

    .stat-icon.success {
      background: rgba(0, 255, 255, 0.2);
      border-color: var(--neon-cyan);
    }

    .stat-icon.success i {
      color: var(--neon-cyan);
    }

    .stat-icon.warning {
      background: rgba(255, 136, 0, 0.2);
      border-color: var(--neon-orange);
    }

    .stat-icon.warning i {
      color: var(--neon-orange);
    }

    .stat-icon.info {
      background: rgba(255, 255, 0, 0.2);
      border-color: var(--neon-yellow);
    }

    .stat-icon.info i {
      color: var(--neon-yellow);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-family: var(--font-primary);
      font-weight: 900;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0.25rem;
    }

    .performance-chart {
      text-align: center;
    }

    .performance-chart h4 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .chart-placeholder {
      padding: 3rem;
      border: 2px dashed rgba(0, 255, 0, 0.3);
      border-radius: 12px;
      color: var(--text-muted);
    }

    .chart-placeholder i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .settings-section {
      grid-column: 1 / -1;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .setting-item:hover {
      border-color: rgba(0, 255, 0, 0.3);
      background: rgba(0, 255, 0, 0.05);
    }

    .setting-info {
      flex: 1;
    }

    .setting-name {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .setting-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      transition: 0.3s;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background-color: var(--text-muted);
      border-radius: 50%;
      transition: 0.3s;
    }

    input:checked + .toggle-slider {
      background-color: rgba(0, 255, 0, 0.3);
      border-color: var(--neon-green);
    }

    input:checked + .toggle-slider:before {
      background-color: var(--neon-green);
      transform: translateX(26px);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .profil-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .personal-info,
      .vehicle-info,
      .stats-section,
      .settings-section {
        padding: 1rem;
      }

      .setting-item {
        padding: 1rem;
      }
    }
  `]
})
export class LivreurProfilComponent implements OnInit {
  profilForm: FormGroup;
  isEditing = false;
  currentUser: Utilisateur | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profilForm = this.fb.group({
      prenom: [''],
      nom: [''],
      email: [''],
      telephone: [''],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profilForm.patchValue({
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          telephone: user.telephone || '',
          adresse: user.adresse || ''
        });
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Restaurer les valeurs originales
    if (this.currentUser) {
      this.profilForm.patchValue({
        prenom: this.currentUser.prenom,
        nom: this.currentUser.nom,
        email: this.currentUser.email,
        telephone: this.currentUser.telephone || '',
        adresse: this.currentUser.adresse || ''
      });
    }
  }

  saveProfile(): void {
    if (this.profilForm.valid) {
      // TODO: Sauvegarder les modifications dans Firestore
      console.log('Sauvegarder profil:', this.profilForm.value);
      this.isEditing = false;
    }
  }
}