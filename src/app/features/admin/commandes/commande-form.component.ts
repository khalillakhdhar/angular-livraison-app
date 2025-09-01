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
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { 
  Commande, 
  CreateCommandeRequest, 
  UpdateCommandeRequest,
  TypeLivraison,
  EtatLivraison,
  Adresse
} from '../../../core/models';
import { TnLocationsService, UserService } from '../../../core/services';
import { Gouvernorat, Ville } from '../../../core/models/location.model';
import { Utilisateur } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-commande-form',
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
    MatSnackBarModule
  ],
  template: `
    <div class="glass-card commande-form-container">
      <div class="form-header">
        <h2>{{ isEditMode ? 'Modifier la commande' : 'Nouvelle commande' }}</h2>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="commandeForm" (ngSubmit)="onSubmit()">
        <!-- Type et État -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Type de livraison</mat-label>
            <mat-select formControlName="typeLivraison">
              <mat-option value="pickup">Pickup</mat-option>
              <mat-option value="livraison">Livraison</mat-option>
              <mat-option value="retour">Retour</mat-option>
            </mat-select>
            <mat-error *ngIf="commandeForm.get('typeLivraison')?.hasError('required')">
              Le type de livraison est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field" *ngIf="isEditMode">
            <mat-label>État de livraison</mat-label>
            <mat-select formControlName="etatLivraison">
              <mat-option value="nouvelle">Nouvelle</mat-option>
              <mat-option value="assignée">Assignée</mat-option>
              <mat-option value="en_cours">En cours</mat-option>
              <mat-option value="en_attente">En attente</mat-option>
              <mat-option value="retard">Retard</mat-option>
              <mat-option value="livrée">Livrée</mat-option>
              <mat-option value="échouée">Échouée</mat-option>
              <mat-option value="annulée">Annulée</mat-option>
              <mat-option value="retour">Retour</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Adresse de pickup -->
        <div class="address-section">
          <h3 class="section-title">
            <mat-icon>place</mat-icon>
            Adresse de récupération
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Libellé</mat-label>
              <input matInput formControlName="pickupLabel" placeholder="Ex: Entrepôt principal">
              <mat-error *ngIf="commandeForm.get('pickupLabel')?.hasError('required')">
                Le libellé de pickup est requis
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Gouvernorat de pickup</mat-label>
              <mat-select formControlName="pickupGouvernorat" (selectionChange)="onPickupGouvernoratChange()">
                <mat-option *ngFor="let gouv of gouvernorats" [value]="gouv.id">
                  {{ gouv.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ville de pickup</mat-label>
              <mat-select formControlName="pickupVille" [disabled]="!selectedPickupGouvernorat">
                <mat-option *ngFor="let ville of pickupVilles" [value]="ville.id">
                  {{ ville.nom }}
                </mat-option>
              </mat-select>
              <mat-hint *ngIf="!selectedPickupGouvernorat">
                Sélectionnez d'abord un gouvernorat
              </mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Adresse de livraison -->
        <div class="address-section">
          <h3 class="section-title">
            <mat-icon>local_shipping</mat-icon>
            Adresse de livraison
          </h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Libellé</mat-label>
              <input matInput formControlName="livraisonLabel" placeholder="Ex: Client - Tunis Centre">
              <mat-error *ngIf="commandeForm.get('livraisonLabel')?.hasError('required')">
                Le libellé de livraison est requis
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Gouvernorat de livraison</mat-label>
              <mat-select formControlName="livraisonGouvernorat" (selectionChange)="onLivraisonGouvernoratChange()">
                <mat-option *ngFor="let gouv of gouvernorats" [value]="gouv.id">
                  {{ gouv.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ville de livraison</mat-label>
              <mat-select formControlName="livraisonVille" [disabled]="!selectedLivraisonGouvernorat">
                <mat-option *ngFor="let ville of livraisonVilles" [value]="ville.id">
                  {{ ville.nom }}
                </mat-option>
              </mat-select>
              <mat-hint *ngIf="!selectedLivraisonGouvernorat">
                Sélectionnez d'abord un gouvernorat
              </mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Prix, Client, Livreur -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Prix (DT)</mat-label>
            <input matInput type="number" formControlName="prix" min="0" step="0.01" placeholder="0.00">
            <mat-error *ngIf="commandeForm.get('prix')?.hasError('required')">
              Le prix est requis
            </mat-error>
            <mat-error *ngIf="commandeForm.get('prix')?.hasError('min')">
              Le prix doit être positif
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Client</mat-label>
            <mat-select formControlName="clientId">
              <mat-option *ngFor="let client of clients" [value]="client.uid">
                {{ client.prenom }} {{ client.nom }} ({{ client.email }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Livreur (optionnel)</mat-label>
            <mat-select formControlName="livreurId">
              <mat-option value="">Aucun livreur assigné</mat-option>
              <mat-option *ngFor="let livreur of livreurs" [value]="livreur.uid">
                {{ livreur.prenom }} {{ livreur.nom }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Notes -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="3" placeholder="Notes additionnelles..."></textarea>
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
            [disabled]="commandeForm.invalid || isLoading"
            class="neon-btn save-btn">
            <mat-spinner *ngIf="isLoading" diameter="20" class="btn-spinner"></mat-spinner>
            <span *ngIf="!isLoading">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .commande-form-container {
      max-width: 800px;
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

    .address-section {
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
      .commande-form-container {
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
export class CommandeFormComponent implements OnInit, OnDestroy {
  @Input() commande: Commande | null = null;
  @Output() submit = new EventEmitter<CreateCommandeRequest | UpdateCommandeRequest>();
  @Output() cancel = new EventEmitter<void>();

  commandeForm!: FormGroup;
  gouvernorats: Gouvernorat[] = [];
  pickupVilles: Ville[] = [];
  livraisonVilles: Ville[] = [];
  clients: Utilisateur[] = [];
  livreurs: Utilisateur[] = [];

  selectedPickupGouvernorat: string = '';
  selectedLivraisonGouvernorat: string = '';
  isEditMode = false;
  isLoading = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private tnLocationsService: TnLocationsService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadInitialData();
    this.isEditMode = !!this.commande;
    
    if (this.commande) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initializeForm() {
    this.commandeForm = this.fb.group({
      typeLivraison: ['', Validators.required],
      etatLivraison: ['nouvelle'],
      pickupLabel: ['', Validators.required],
      pickupGouvernorat: [''],
      pickupVille: [''],
      livraisonLabel: ['', Validators.required],
      livraisonGouvernorat: [''],
      livraisonVille: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      clientId: [''],
      livreurId: [''],
      notes: ['']
    });

    // Watch gouvernorat changes
    this.subscriptions.add(
      this.commandeForm.get('pickupGouvernorat')?.valueChanges.pipe(
        startWith(this.commandeForm.get('pickupGouvernorat')?.value)
      ).subscribe(gouvernoratId => {
        if (gouvernoratId && gouvernoratId !== this.selectedPickupGouvernorat) {
          this.commandeForm.get('pickupVille')?.setValue('');
        }
      }) || new Subscription()
    );

    this.subscriptions.add(
      this.commandeForm.get('livraisonGouvernorat')?.valueChanges.pipe(
        startWith(this.commandeForm.get('livraisonGouvernorat')?.value)
      ).subscribe(gouvernoratId => {
        if (gouvernoratId && gouvernoratId !== this.selectedLivraisonGouvernorat) {
          this.commandeForm.get('livraisonVille')?.setValue('');
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
            
            // If editing and commande has addresses, load villes
            if (this.commande) {
              if (this.commande.pickupAdresse.gouvernorat) {
                this.loadPickupVilles(this.commande.pickupAdresse.gouvernorat);
              }
              if (this.commande.livraisonAdresse.gouvernorat) {
                this.loadLivraisonVilles(this.commande.livraisonAdresse.gouvernorat);
              }
            }
          },
          error => {
            this.snackBar.open('Erreur lors du chargement des gouvernorats', 'Fermer', { duration: 5000 });
          }
        )
      );

      // Load users
      const users = await this.userService.getAllUsers();
      this.clients = users.filter(user => user.role === 'client');
      this.livreurs = users.filter(user => user.role === 'livreur');
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 5000 });
    }
  }

  private populateForm() {
    if (this.commande) {
      this.commandeForm.patchValue({
        typeLivraison: this.commande.typeLivraison,
        etatLivraison: this.commande.etatLivraison,
        pickupLabel: this.commande.pickupAdresse.label,
        pickupGouvernorat: this.commande.pickupAdresse.gouvernorat,
        pickupVille: this.commande.pickupAdresse.ville,
        livraisonLabel: this.commande.livraisonAdresse.label,
        livraisonGouvernorat: this.commande.livraisonAdresse.gouvernorat,
        livraisonVille: this.commande.livraisonAdresse.ville,
        prix: this.commande.prix,
        clientId: this.commande.clientId,
        livreurId: this.commande.livreurId || '',
        notes: this.commande.notes || ''
      });
      
      this.selectedPickupGouvernorat = this.commande.pickupAdresse.gouvernorat;
      this.selectedLivraisonGouvernorat = this.commande.livraisonAdresse.gouvernorat;
    }
  }

  onPickupGouvernoratChange() {
    const gouvernoratId = this.commandeForm.get('pickupGouvernorat')?.value;
    if (gouvernoratId) {
      this.selectedPickupGouvernorat = gouvernoratId;
      this.loadPickupVilles(gouvernoratId);
      this.commandeForm.get('pickupVille')?.setValue('');
    }
  }

  onLivraisonGouvernoratChange() {
    const gouvernoratId = this.commandeForm.get('livraisonGouvernorat')?.value;
    if (gouvernoratId) {
      this.selectedLivraisonGouvernorat = gouvernoratId;
      this.loadLivraisonVilles(gouvernoratId);
      this.commandeForm.get('livraisonVille')?.setValue('');
    }
  }

  private loadPickupVilles(gouvernoratId: string) {
    this.subscriptions.add(
      this.tnLocationsService.getVillesByGouvernorat(gouvernoratId).subscribe(
        villes => {
          this.pickupVilles = villes;
        },
        error => {
          this.snackBar.open('Erreur lors du chargement des villes de pickup', 'Fermer', { duration: 5000 });
        }
      )
    );
  }

  private loadLivraisonVilles(gouvernoratId: string) {
    this.subscriptions.add(
      this.tnLocationsService.getVillesByGouvernorat(gouvernoratId).subscribe(
        villes => {
          this.livraisonVilles = villes;
        },
        error => {
          this.snackBar.open('Erreur lors du chargement des villes de livraison', 'Fermer', { duration: 5000 });
        }
      )
    );
  }

  onSubmit() {
    if (this.commandeForm.valid) {
      this.isLoading = true;
      
      const formValue = this.commandeForm.getRawValue();
      
      const pickupAdresse: Adresse = {
        label: formValue.pickupLabel,
        ville: formValue.pickupVille,
        gouvernorat: formValue.pickupGouvernorat,
        lat: 0, // TODO: Get actual coordinates
        lng: 0
      };

      const livraisonAdresse: Adresse = {
        label: formValue.livraisonLabel,
        ville: formValue.livraisonVille,
        gouvernorat: formValue.livraisonGouvernorat,
        lat: 0, // TODO: Get actual coordinates
        lng: 0
      };
      
      if (this.isEditMode) {
        const updateRequest: UpdateCommandeRequest = {
          typeLivraison: formValue.typeLivraison,
          etatLivraison: formValue.etatLivraison,
          pickupAdresse,
          livraisonAdresse,
          prix: formValue.prix,
          livreurId: formValue.livreurId || undefined,
          notes: formValue.notes || undefined
        };
        this.submit.emit(updateRequest);
      } else {
        const createRequest: CreateCommandeRequest = {
          typeLivraison: formValue.typeLivraison,
          pickupAdresse,
          livraisonAdresse,
          prix: formValue.prix,
          clientId: formValue.clientId,
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
    Object.keys(this.commandeForm.controls).forEach(key => {
      const control = this.commandeForm.get(key);
      control?.markAsTouched();
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }
}