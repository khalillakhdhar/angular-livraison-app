import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Utilisateur } from '../../core/interfaces/utilisateur';

@Component({
  selector: 'app-client-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profil-container">
      <div class="page-header">
        <h2>Mon Profil</h2>
        <p class="subtitle">Gérez vos informations personnelles et préférences</p>
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
                [readonly]="!isEditing"
              >
            </div>

            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                type="text"
                id="nom"
                formControlName="nom"
                class="futuristic-input"
                [readonly]="!isEditing"
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
              <div class="field-note">L'email ne peut pas être modifié</div>
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                formControlName="telephone"
                class="futuristic-input"
                [readonly]="!isEditing"
                placeholder="Votre numéro de téléphone"
              >
            </div>

            <div class="form-group">
              <label for="adresse">Adresse de livraison principale</label>
              <textarea
                id="adresse"
                formControlName="adresse"
                class="futuristic-input"
                rows="3"
                [readonly]="!isEditing"
                placeholder="Votre adresse complète"
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
              Modifier mes informations
            </button>
          </div>
        </div>

        <!-- Préférences -->
        <div class="preferences glass-card">
          <h3>Préférences de Livraison</h3>
          
          <div class="preferences-content">
            <div class="preference-section">
              <h4>Adresses de livraison</h4>
              <div class="addresses-list">
                <div class="address-item">
                  <div class="address-content">
                    <div class="address-label">
                      <i class="material-icons">home</i>
                      <span>Domicile</span>
                    </div>
                    <div class="address-text">123 Rue de la Paix, 75001 Paris</div>
                  </div>
                  <button class="address-action">
                    <i class="material-icons">edit</i>
                  </button>
                </div>

                <div class="address-item">
                  <div class="address-content">
                    <div class="address-label">
                      <i class="material-icons">work</i>
                      <span>Bureau</span>
                    </div>
                    <div class="address-text">45 Avenue des Champs, 75008 Paris</div>
                  </div>
                  <button class="address-action">
                    <i class="material-icons">edit</i>
                  </button>
                </div>

                <button class="add-address-btn neon-btn">
                  <i class="material-icons">add</i>
                  Ajouter une adresse
                </button>
              </div>
            </div>

            <div class="preference-section">
              <h4>Créneaux préférés</h4>
              <div class="time-preferences">
                <div class="time-slot">
                  <span>Matin (8h-12h)</span>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="time-slot">
                  <span>Après-midi (12h-18h)</span>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="time-slot">
                  <span>Soir (18h-22h)</span>
                  <label class="toggle-switch">
                    <input type="checkbox">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques client -->
      <div class="stats-section glass-card">
        <h3>Mes Statistiques</h3>
        
        <div class="stats-grid grid grid-4">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="material-icons">shopping_cart</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">32</div>
              <div class="stat-label">Commandes Total</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon success">
              <i class="material-icons">euro</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">847€</div>
              <div class="stat-label">Total Dépensé</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon warning">
              <i class="material-icons">favorite</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">4.9/5</div>
              <div class="stat-label">Note Moyenne</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon info">
              <i class="material-icons">timeline</i>
            </div>
            <div class="stat-content">
              <div class="stat-value">23 min</div>
              <div class="stat-label">Livraison Moyenne</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paramètres -->
      <div class="settings-section glass-card">
        <h3>Paramètres & Notifications</h3>
        
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Notifications de commande</div>
              <div class="setting-desc">Recevoir des notifications lors des changements de statut</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">SMS de livraison</div>
              <div class="setting-desc">Recevoir un SMS quand le livreur arrive</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Offres promotionnelles</div>
              <div class="setting-desc">Recevoir les offres spéciales et promotions</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Newsletter</div>
              <div class="setting-desc">Recevoir la newsletter hebdomadaire</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Géolocalisation</div>
              <div class="setting-desc">Partager ma position pour optimiser les livraisons</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="danger-zone">
          <h4>Zone de Danger</h4>
          <div class="danger-actions">
            <button class="danger-btn">
              <i class="material-icons">block</i>
              Désactiver mon compte temporairement
            </button>
            <button class="danger-btn">
              <i class="material-icons">delete_forever</i>
              Supprimer définitivement mon compte
            </button>
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
      color: var(--neon-cyan);
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
    .preferences,
    .stats-section,
    .settings-section {
      padding: 2rem;
    }

    .personal-info h3,
    .preferences h3,
    .stats-section h3,
    .settings-section h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-cyan);
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

    .field-note {
      color: var(--text-muted);
      font-size: 0.8rem;
      font-style: italic;
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

    .preferences-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .preference-section h4 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .addresses-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .address-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .address-item:hover {
      border-color: rgba(0, 255, 255, 0.3);
      background: rgba(0, 255, 255, 0.05);
    }

    .address-content {
      flex: 1;
    }

    .address-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .address-label i {
      color: var(--neon-cyan);
    }

    .address-label span {
      color: var(--text-primary);
      font-weight: 600;
    }

    .address-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .address-action {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 6px;
      background: rgba(0, 255, 255, 0.1);
      color: var(--neon-cyan);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .address-action:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .add-address-btn {
      margin-top: 0.5rem;
      align-self: flex-start;
    }

    .time-preferences {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .time-slot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }

    .time-slot span {
      color: var(--text-primary);
      font-weight: 500;
    }

    .stats-section {
      grid-column: 1 / -1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-item {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: rgba(0, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neon-cyan);
    }

    .stat-icon i {
      font-size: 1.5rem;
      color: var(--neon-cyan);
    }

    .stat-icon.success {
      background: rgba(0, 255, 0, 0.2);
      border-color: var(--neon-green);
    }

    .stat-icon.success i {
      color: var(--neon-green);
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

    .settings-section {
      grid-column: 1 / -1;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
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
      border-color: rgba(0, 255, 255, 0.3);
      background: rgba(0, 255, 255, 0.05);
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
      background-color: rgba(0, 255, 255, 0.3);
      border-color: var(--neon-cyan);
    }

    input:checked + .toggle-slider:before {
      background-color: var(--neon-cyan);
      transform: translateX(26px);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .danger-zone {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 0, 255, 0.3);
    }

    .danger-zone h4 {
      color: var(--neon-magenta);
      margin-bottom: 1rem;
      font-family: var(--font-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .danger-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .danger-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border: 1px solid var(--neon-magenta);
      background: rgba(255, 0, 255, 0.1);
      color: var(--neon-magenta);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      align-self: flex-start;
    }

    .danger-btn:hover {
      background: rgba(255, 0, 255, 0.2);
      transform: translateY(-1px);
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

      .danger-actions {
        align-items: stretch;
      }

      .danger-btn {
        align-self: stretch;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .personal-info,
      .preferences,
      .stats-section,
      .settings-section {
        padding: 1rem;
      }

      .setting-item {
        padding: 1rem;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
    }
  `]
})
export class ClientProfilComponent implements OnInit {
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