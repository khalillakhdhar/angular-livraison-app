import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { Utilisateur, CreateUtilisateurRequest, UpdateUtilisateurRequest } from '../../../core/models';
import { TnLocationsService } from '../../../core/services';
import { Gouvernorat, Ville } from '../../../core/models/location.model';

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="glass-card utilisateur-form-container">
      <div class="form-header">
        <h2>{{ isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}</h2>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="exemple@domain.com">
            <mat-error *ngIf="userForm.get('email')?.hasError('required')">
              L'email est requis
            </mat-error>
            <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Format d'email invalide
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Rôle</mat-label>
            <mat-select formControlName="role">
              <mat-option value="admin">Admin</mat-option>
              <mat-option value="livreur">Livreur</mat-option>
              <mat-option value="client">Client</mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('role')?.hasError('required')">
              Le rôle est requis
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="prenom" placeholder="Prénom">
            <mat-error *ngIf="userForm.get('prenom')?.hasError('required')">
              Le prénom est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="nom" placeholder="Nom de famille">
            <mat-error *ngIf="userForm.get('nom')?.hasError('required')">
              Le nom est requis
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="telephone" placeholder="+216 12 345 678">
          </mat-form-field>

          <div class="checkbox-field">
            <mat-checkbox formControlName="actif" class="neon-checkbox">
              Utilisateur actif
            </mat-checkbox>
          </div>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Gouvernorat</mat-label>
            <mat-select formControlName="gouvernorat" (selectionChange)="onGouvernoratChange()">
              <mat-option *ngFor="let gouv of gouvernorats" [value]="gouv.id">
                {{ gouv.nom }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Ville</mat-label>
            <mat-select formControlName="ville" [disabled]="!selectedGouvernorat">
              <mat-option *ngFor="let ville of villes" [value]="ville.id">
                {{ ville.nom }}
              </mat-option>
            </mat-select>
            <mat-hint *ngIf="!selectedGouvernorat">
              Sélectionnez d'abord un gouvernorat
            </mat-hint>
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
            [disabled]="userForm.invalid || isLoading"
            class="neon-btn save-btn">
            <mat-spinner *ngIf="isLoading" diameter="20" class="btn-spinner"></mat-spinner>
            <span *ngIf="!isLoading">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .utilisateur-form-container {
      max-width: 600px;
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

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-start;
    }

    .form-field {
      flex: 1;
    }

    .checkbox-field {
      display: flex;
      align-items: center;
      margin-top: 8px;
      flex: 1;
    }

    .neon-checkbox {
      color: #00ff00;
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
      .utilisateur-form-container {
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
export class UtilisateurFormComponent implements OnInit, OnDestroy {
  @Input() user: Utilisateur | null = null;
  @Output() submit = new EventEmitter<CreateUtilisateurRequest | UpdateUtilisateurRequest>();
  @Output() cancel = new EventEmitter<void>();

  userForm!: FormGroup;
  gouvernorats: Gouvernorat[] = [];
  villes: Ville[] = [];
  selectedGouvernorat: string = '';
  isEditMode = false;
  isLoading = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private tnLocationsService: TnLocationsService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadGouvernorats();
    this.isEditMode = !!this.user;
    
    if (this.user) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initializeForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      role: ['', Validators.required],
      telephone: [''],
      gouvernorat: [''],
      ville: [''],
      actif: [true]
    });

    // Watch gouvernorat changes to reset ville
    this.subscriptions.add(
      this.userForm.get('gouvernorat')?.valueChanges.pipe(
        startWith(this.userForm.get('gouvernorat')?.value)
      ).subscribe(gouvernoratId => {
        if (gouvernoratId && gouvernoratId !== this.selectedGouvernorat) {
          this.userForm.get('ville')?.setValue('');
        }
      }) || new Subscription()
    );
  }

  private loadGouvernorats() {
    this.subscriptions.add(
      this.tnLocationsService.getGouvernorats().subscribe(
        gouvernorats => {
          this.gouvernorats = gouvernorats;
          
          // If editing and user has a gouvernorat, load villes
          if (this.user?.gouvernorat) {
            this.loadVillesByGouvernorat(this.user.gouvernorat);
          }
        },
        error => {
          this.snackBar.open('Erreur lors du chargement des gouvernorats', 'Fermer', { duration: 5000 });
        }
      )
    );
  }

  private populateForm() {
    if (this.user) {
      this.userForm.patchValue({
        email: this.user.email,
        prenom: this.user.prenom,
        nom: this.user.nom,
        role: this.user.role,
        telephone: this.user.telephone,
        gouvernorat: this.user.gouvernorat,
        ville: this.user.ville,
        actif: this.user.actif
      });
      
      this.selectedGouvernorat = this.user.gouvernorat;
      
      // Disable email in edit mode
      this.userForm.get('email')?.disable();
    }
  }

  onGouvernoratChange() {
    const gouvernoratId = this.userForm.get('gouvernorat')?.value;
    if (gouvernoratId) {
      this.selectedGouvernorat = gouvernoratId;
      this.loadVillesByGouvernorat(gouvernoratId);
      this.userForm.get('ville')?.setValue('');
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

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      const formValue = this.userForm.getRawValue();
      
      if (this.isEditMode) {
        const updateRequest: UpdateUtilisateurRequest = {
          prenom: formValue.prenom,
          nom: formValue.nom,
          role: formValue.role,
          telephone: formValue.telephone,
          gouvernorat: formValue.gouvernorat,
          ville: formValue.ville,
          actif: formValue.actif
        };
        this.submit.emit(updateRequest);
      } else {
        const createRequest: CreateUtilisateurRequest = {
          email: formValue.email,
          password: 'MotDePasseTemp123!', // TODO: Add password generation or field
          prenom: formValue.prenom,
          nom: formValue.nom,
          role: formValue.role,
          telephone: formValue.telephone,
          gouvernorat: formValue.gouvernorat,
          ville: formValue.ville,
          actif: formValue.actif
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
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  // Method to be called by parent when operation is complete
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }
}