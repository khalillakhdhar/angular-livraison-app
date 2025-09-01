import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { 
  Sortie, 
  CreateSortieRequest, 
  UpdateSortieRequest,
  StatutSortie,
  Commande,
  EtatLivraison
} from '../../../core/models';
import { TnLocationsService, UserService, OrderService } from '../../../core/services';
import { Gouvernorat, Ville } from '../../../core/models/location.model';
import { Utilisateur } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-sortie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule
  ],
  template: `
    <div class="glass-card sortie-form-container">
      <div class="form-header">
        <h2>{{ isEditMode ? 'Modifier la sortie' : 'Nouvelle sortie' }}</h2>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="sortieForm" (ngSubmit)="onSubmit()">
        <!-- Date et Livreur -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Date de la sortie</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" placeholder="Sélectionner une date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="sortieForm.get('date')?.hasError('required')">
              La date est requise
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Livreur</mat-label>
            <mat-select formControlName="livreurId">
              <mat-option *ngFor="let livreur of livreurs" [value]="livreur.uid">
                {{ livreur.prenom }} {{ livreur.nom }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="sortieForm.get('livreurId')?.hasError('required')">
              Le livreur est requis
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Zone géographique -->
        <div class="zone-section">
          <h3 class="section-title">
            <mat-icon>location_on</mat-icon>
            Zone de livraison
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Gouvernorat</mat-label>
              <mat-select formControlName="gouvernorat" (selectionChange)="onGouvernoratChange()">
                <mat-option *ngFor="let gouv of gouvernorats" [value]="gouv.id">
                  {{ gouv.nom }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="sortieForm.get('gouvernorat')?.hasError('required')">
                Le gouvernorat est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ville de départ</mat-label>
              <mat-select formControlName="villeDepart" [disabled]="!selectedGouvernorat">
                <mat-option *ngFor="let ville of villes" [value]="ville.id">
                  {{ ville.nom }}
                </mat-option>
              </mat-select>
              <mat-hint *ngIf="!selectedGouvernorat">
                Sélectionnez d'abord un gouvernorat
              </mat-hint>
              <mat-error *ngIf="sortieForm.get('villeDepart')?.hasError('required')">
                La ville de départ est requise
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Villes desservies</mat-label>
              <mat-select formControlName="villesDesservies" multiple [disabled]="!selectedGouvernorat">
                <mat-option *ngFor="let ville of villes" [value]="ville.id">
                  {{ ville.nom }}
                </mat-option>
              </mat-select>
              <mat-hint>Sélectionnez toutes les villes qui seront desservies dans cette sortie</mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Commandes disponibles -->
        <div class="commandes-section" *ngIf="availableCommandes.length > 0">
          <h3 class="section-title">
            <mat-icon>shopping_cart</mat-icon>
            Commandes disponibles
            <span class="badge">{{ availableCommandes.length }}</span>
          </h3>
          
          <div class="commandes-list">
            <mat-list>
              <mat-list-item *ngFor="let commande of availableCommandes">
                <mat-checkbox 
                  [checked]="isCommandeSelected(commande.id)"
                  (change)="toggleCommande(commande.id)"
                  class="commande-checkbox">
                </mat-checkbox>
                <div class="commande-info">
                  <div class="commande-header">
                    <span class="commande-numero">{{ commande.numero }}</span>
                    <mat-chip [class]="'etat-' + commande.etatLivraison.replace('_', '-')">
                      {{ getEtatLabel(commande.etatLivraison) }}
                    </mat-chip>
                  </div>
                  <div class="commande-details">
                    <div class="addresses">
                      <span class="pickup">{{ commande.pickupAdresse.ville }}</span>
                      <mat-icon>arrow_forward</mat-icon>
                      <span class="livraison">{{ commande.livraisonAdresse.ville }}</span>
                    </div>
                    <div class="prix">{{ commande.prix | currency:'TND':'symbol':'1.2-2' }}</div>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
        </div>

        <div class="no-commandes" *ngIf="selectedGouvernorat && availableCommandes.length === 0">
          <mat-icon>info</mat-icon>
          <p>Aucune commande disponible pour ce gouvernorat</p>
        </div>

        <!-- Statut (en mode édition) -->
        <div class="form-row" *ngIf="isEditMode">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="statut">
              <mat-option value="planifiée">Planifiée</mat-option>
              <mat-option value="en_route">En route</mat-option>
              <mat-option value="terminée">Terminée</mat-option>
              <mat-option value="annulée">Annulée</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Notes -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="3" placeholder="Notes pour la sortie..."></textarea>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            mat-stroked-button 
            (click)="onCancel()"
            class="cancel-btn">
            Annuler
          </button>
          <button 
            type="submit" 
            mat-raised-button 
            [disabled]="sortieForm.invalid || isLoading"
            class="neon-btn save-btn">
            <mat-spinner *ngIf="isLoading" diameter="20" class="btn-spinner"></mat-spinner>
            <span *ngIf="!isLoading">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .sortie-form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    }

    .form-header h2 {
      color: #00ffff;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .close-btn {
      color: #ff006f;
    }

    .zone-section, .commandes-section {
      margin: 24px 0;
      padding: 16px;
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(0, 255, 255, 0.05);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #00ffff;
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 16px 0;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
    }

    .section-title mat-icon {
      color: #ff00ff;
    }

    .badge {
      background: #ff00ff;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-start;
    }

    .form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .commandes-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.2);
    }

    .commande-checkbox {
      margin-right: 16px;
      color: #00ff00;
    }

    .commande-info {
      flex: 1;
      padding: 8px 0;
    }

    .commande-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .commande-numero {
      font-weight: 600;
      color: #00ffff;
    }

    .commande-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .addresses {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pickup {
      color: #ff00ff;
    }

    .livraison {
      color: #00ff00;
    }

    .prix {
      font-weight: 600;
      color: #00ff00;
    }

    .no-commandes {
      text-align: center;
      padding: 32px;
      color: #999;
    }

    .no-commandes mat-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    /* État chips */
    .etat-nouvelle {
      background: #607d8b;
      color: white;
    }

    .etat-assignee {
      background: #2196f3;
      color: white;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cancel-btn {
      color: #ccc;
      border-color: #666;
    }

    .neon-btn {
      background: linear-gradient(45deg, #00ffff, #ff00ff);
      color: #000;
      font-weight: 600;
      text-transform: uppercase;
      border: none;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .neon-btn:hover {
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
      transform: translateY(-2px);
    }

    .neon-btn:disabled {
      opacity: 0.6;
      box-shadow: none;
      transform: none;
    }

    .btn-spinner {
      margin-right: 8px;
    }

    /* Material form field customization */
    ::ng-deep .mat-mdc-form-field {
      .mat-mdc-text-field-wrapper {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }
      
      .mdc-notched-outline__leading,
      .mdc-notched-outline__notch,
      .mdc-notched-outline__trailing {
        border-color: rgba(0, 255, 255, 0.5);
      }
      
      &.mat-focused .mdc-notched-outline__leading,
      &.mat-focused .mdc-notched-outline__notch,
      &.mat-focused .mdc-notched-outline__trailing {
        border-color: #00ffff;
        box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
      }
      
      .mat-mdc-form-field-label {
        color: #00ffff;
      }
      
      .mat-mdc-input-element {
        color: #fff;
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sortie-form-container {
        margin: 8px;
        padding: 16px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 8px;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SortieFormComponent implements OnInit, OnDestroy {
  @Input() sortie: Sortie | null = null;
  @Output() submit = new EventEmitter<CreateSortieRequest | UpdateSortieRequest>();
  @Output() cancel = new EventEmitter<void>();

  sortieForm!: FormGroup;
  gouvernorats: Gouvernorat[] = [];
  villes: Ville[] = [];
  livreurs: Utilisateur[] = [];
  availableCommandes: Commande[] = [];
  selectedCommandeIds: string[] = [];

  selectedGouvernorat: string = '';
  isEditMode = false;
  isLoading = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private tnLocationsService: TnLocationsService,
    private userService: UserService,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadInitialData();
    this.isEditMode = !!this.sortie;
    
    if (this.sortie) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initializeForm() {
    this.sortieForm = this.fb.group({
      date: [new Date(), Validators.required],
      livreurId: ['', Validators.required],
      gouvernorat: ['', Validators.required],
      villeDepart: ['', Validators.required],
      villesDesservies: [[]],
      statut: ['planifiée'],
      notes: ['']
    });

    // Watch gouvernorat changes to load villes and commandes
    this.subscriptions.add(
      this.sortieForm.get('gouvernorat')?.valueChanges.pipe(
        startWith(this.sortieForm.get('gouvernorat')?.value)
      ).subscribe(gouvernoratId => {
        if (gouvernoratId && gouvernoratId !== this.selectedGouvernorat) {
          this.sortieForm.get('villeDepart')?.setValue('');
          this.sortieForm.get('villesDesservies')?.setValue([]);
        }
      }) || new Subscription()
    );
  }

  private async loadInitialData() {
    try {
      // Load gouvernorats
      this.subscriptions.add(
        this.tnLocationsService.getGouvernorats().subscribe(
          gouvernorats => {
            this.gouvernorats = gouvernorats;
            
            // If editing and sortie has a gouvernorat, load villes
            if (this.sortie?.gouvernorat) {
              this.loadVillesByGouvernorat(this.sortie.gouvernorat);
              this.loadAvailableCommandes(this.sortie.gouvernorat);
            }
          },
          error => {
            this.snackBar.open('Erreur lors du chargement des gouvernorats', 'Fermer', { duration: 5000 });
          }
        )
      );

      // Load livreurs
      const users = await this.userService.getAllUsers();
      this.livreurs = users.filter(user => user.role === 'livreur' && user.actif);
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 5000 });
    }
  }

  private populateForm() {
    if (this.sortie) {
      this.sortieForm.patchValue({
        date: new Date(this.sortie.date),
        livreurId: this.sortie.livreurId,
        gouvernorat: this.sortie.gouvernorat,
        villeDepart: this.sortie.villeDépart,
        villesDesservies: this.sortie.villesDesservies,
        statut: this.sortie.statut,
        notes: this.sortie.notes || ''
      });
      
      this.selectedGouvernorat = this.sortie.gouvernorat;
      this.selectedCommandeIds = [...this.sortie.commandeIds];
    }
  }

  onGouvernoratChange() {
    const gouvernoratId = this.sortieForm.get('gouvernorat')?.value;
    if (gouvernoratId) {
      this.selectedGouvernorat = gouvernoratId;
      this.loadVillesByGouvernorat(gouvernoratId);
      this.loadAvailableCommandes(gouvernoratId);
      this.sortieForm.get('villeDepart')?.setValue('');
      this.sortieForm.get('villesDesservies')?.setValue([]);
      this.selectedCommandeIds = [];
    }
  }

  private loadVillesByGouvernorat(gouvernoratId: string) {
    this.subscriptions.add(
      this.tnLocationsService.getVillesByGouvernorat(gouvernoratId).subscribe(
        villes => {
          this.villes = villes;
        },
        error => {
          this.snackBar.open('Erreur lors du chargement des villes', 'Fermer', { duration: 5000 });
        }
      )
    );
  }

  private async loadAvailableCommandes(gouvernoratId: string) {
    try {
      // Get commandes available for assignment (nouvelle, assignée)
      const filters = {
        etatLivraison: ['nouvelle', 'assignée'] as EtatLivraison[],
        gouvernoratDepart: gouvernoratId
      };
      
      this.availableCommandes = await this.orderService.getOrdersWithFilters(filters);
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 5000 });
    }
  }

  isCommandeSelected(commandeId: string): boolean {
    return this.selectedCommandeIds.includes(commandeId);
  }

  toggleCommande(commandeId: string) {
    const index = this.selectedCommandeIds.indexOf(commandeId);
    if (index > -1) {
      this.selectedCommandeIds.splice(index, 1);
    } else {
      this.selectedCommandeIds.push(commandeId);
    }
  }

  onSubmit() {
    if (this.sortieForm.valid) {
      this.isLoading = true;
      
      const formValue = this.sortieForm.getRawValue();
      
      if (this.isEditMode) {
        const updateRequest: UpdateSortieRequest = {
          date: formValue.date,
          livreurId: formValue.livreurId,
          gouvernorat: formValue.gouvernorat,
          villeDépart: formValue.villeDepart,
          villesDesservies: formValue.villesDesservies,
          commandeIds: this.selectedCommandeIds,
          statut: formValue.statut,
          notes: formValue.notes || undefined
        };
        this.submit.emit(updateRequest);
      } else {
        const createRequest: CreateSortieRequest = {
          date: formValue.date,
          livreurId: formValue.livreurId,
          gouvernorat: formValue.gouvernorat,
          villeDépart: formValue.villeDepart,
          villesDesservies: formValue.villesDesservies,
          commandeIds: this.selectedCommandeIds,
          notes: formValue.notes || undefined
        };
        this.submit.emit(createRequest);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.sortieForm.controls).forEach(key => {
      const control = this.sortieForm.get(key);
      control?.markAsTouched();
    });
  }

  getEtatLabel(etat: EtatLivraison): string {
    const labels: Record<EtatLivraison, string> = {
      'nouvelle': 'Nouvelle',
      'assignée': 'Assignée',
      'en_cours': 'En cours',
      'en_attente': 'En attente',
      'retard': 'Retard',
      'livrée': 'Livrée',
      'échouée': 'Échouée',
      'annulée': 'Annulée',
      'retour': 'Retour'
    };
    return labels[etat] || etat;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }
}