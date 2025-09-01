import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Utilisateur, CreateUtilisateurRequest, UpdateUtilisateurRequest } from '../../../core/models';
import { UserService } from '../../../core/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UtilisateurFormComponent } from './utilisateur-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    UtilisateurFormComponent
  ],
  template: `
    <div class="users-container">
      <!-- User Form (shown when creating/editing) -->
      <app-utilisateur-form
        *ngIf="showForm"
        [user]="selectedUser"
        (submit)="onFormSubmit($event)"
        (cancel)="onFormCancel()">
      </app-utilisateur-form>

      <!-- Users List (shown when not creating/editing) -->
      <div *ngIf="!showForm" class="users-list">
        <div class="page-header">
          <h1>Gestion des Utilisateurs</h1>
          <button mat-raised-button color="primary" (click)="createUser()">
            <mat-icon>person_add</mat-icon>
            Nouvel utilisateur
          </button>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Nom, email, téléphone...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Rôle</mat-label>
            <mat-select [formControl]="roleFilter" multiple>
              <mat-option value="admin">Admin</mat-option>
              <mat-option value="livreur">Livreur</mat-option>
              <mat-option value="client">Client</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [formControl]="statusFilter">
              <mat-option value="">Tous</mat-option>
              <mat-option value="true">Actif</mat-option>
              <mat-option value="false">Inactif</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Effacer filtres
          </button>
        </div>

        <!-- Users Table -->
        <div class="table-container">
          <table mat-table [dataSource]="filteredUsers" class="users-table" matSort>
            <!-- Avatar Column -->
            <ng-container matColumnDef="avatar">
              <th mat-header-cell *matHeaderCellDef>Photo</th>
              <td mat-cell *matCellDef="let user">
                <div class="user-avatar">
                  <img *ngIf="user.photoURL" [src]="user.photoURL" [alt]="user.prenom">
                  <mat-icon *ngIf="!user.photoURL">account_circle</mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
              <td mat-cell *matCellDef="let user">
                <div class="user-info">
                  <div class="user-name">{{user.prenom}} {{user.nom}}</div>
                  <div class="user-email">{{user.email}}</div>
                </div>
              </td>
            </ng-container>

            <!-- Role Column -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip-set>
                  <mat-chip [class]="'role-' + user.role">{{user.role | titlecase}}</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Localisation</th>
              <td mat-cell *matCellDef="let user">
                <div class="location-info">
                  <div>{{user.ville}}</div>
                  <div class="gouvernorat">{{user.gouvernorat}}</div>
                </div>
              </td>
            </ng-container>

            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Téléphone</th>
              <td mat-cell *matCellDef="let user">{{user.telephone}}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip-set>
                  <mat-chip [class]="user.actif ? 'status-active' : 'status-inactive'">
                    {{user.actif ? 'Actif' : 'Inactif'}}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button [matMenuTriggerFor]="userMenu" [matMenuTriggerData]="{user: user}">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="user-row" (click)="viewUser(row)"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
        </div>
      </div>
    </div>

    <!-- User Actions Menu -->
    <mat-menu #userMenu="matMenu">
      <ng-template matMenuContent let-user="user">
        <button mat-menu-item (click)="editUser(user)">
          <mat-icon>edit</mat-icon>
          <span>Modifier</span>
        </button>
        <button mat-menu-item (click)="resetPassword(user)">
          <mat-icon>lock_reset</mat-icon>
          <span>Réinitialiser mot de passe</span>
        </button>
        <button mat-menu-item (click)="toggleUserStatus(user)">
          <mat-icon>{{user.actif ? 'block' : 'check_circle'}}</mat-icon>
          <span>{{user.actif ? 'Désactiver' : 'Activer'}}</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="deleteUser(user)" class="danger-action">
          <mat-icon>delete</mat-icon>
          <span>Supprimer</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .users-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 300;
      margin: 0;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      min-width: 300px;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-avatar mat-icon {
      font-size: 24px;
      color: #999;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .user-email {
      font-size: 12px;
      color: #666;
    }

    .location-info {
      display: flex;
      flex-direction: column;
    }

    .gouvernorat {
      font-size: 12px;
      color: #666;
    }

    .role-admin {
      background: #f44336;
      color: white;
    }

    .role-livreur {
      background: #2196f3;
      color: white;
    }

    .role-client {
      background: #4caf50;
      color: white;
    }

    .status-active {
      background: #4caf50;
      color: white;
    }

    .status-inactive {
      background: #ff9800;
      color: white;
    }

    .user-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .user-row:hover {
      background: #f5f5f5;
    }

    .danger-action {
      color: #f44336;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'name', 'role', 'location', 'phone', 'status', 'actions'];
  users: Utilisateur[] = [];
  filteredUsers: Utilisateur[] = [];

  searchControl = new FormControl('');
  roleFilter = new FormControl<string[]>([]);
  statusFilter = new FormControl('');

  // Form state
  showForm = false;
  selectedUser: Utilisateur | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.setupFilters();
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  private setupFilters() {
    // Search filter
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    // Role filter
    this.roleFilter.valueChanges.subscribe(() => this.applyFilters());

    // Status filter
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private async loadUsers() {
    try {
      this.users = await this.userService.getAllUsers();
      this.applyFilters();
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 5000 });
    }
  }

  private applyFilters() {
    let filtered = [...this.users];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nom.toLowerCase().includes(searchTerm) ||
        user.prenom.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.telephone.includes(searchTerm)
      );
    }

    // Apply role filter
    const selectedRoles = this.roleFilter.value || [];
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(user => selectedRoles.includes(user.role));
    }

    // Apply status filter
    const statusValue = this.statusFilter.value;
    if (statusValue !== '') {
      const isActive = statusValue === 'true';
      filtered = filtered.filter(user => user.actif === isActive);
    }

    this.filteredUsers = filtered;
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.roleFilter.setValue([]);
    this.statusFilter.setValue('');
  }

  createUser() {
    this.selectedUser = null;
    this.showForm = true;
  }

  viewUser(user: Utilisateur) {
    // TODO: Open user details dialog or navigate to details page
    console.log('View user:', user);
  }

  editUser(user: Utilisateur) {
    this.selectedUser = user;
    this.showForm = true;
  }

  async onFormSubmit(data: CreateUtilisateurRequest | UpdateUtilisateurRequest) {
    try {
      if (this.selectedUser) {
        // Update existing user
        await this.userService.updateUser(this.selectedUser.uid, data as UpdateUtilisateurRequest);
        this.snackBar.open('Utilisateur modifié avec succès', 'Fermer', { duration: 3000 });
      } else {
        // Create new user
        await this.userService.createUser(data as CreateUtilisateurRequest);
        this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
      }
      
      this.showForm = false;
      this.selectedUser = null;
      await this.loadUsers();
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Erreur lors de l\'enregistrement', 
        'Fermer', 
        { duration: 5000 }
      );
    }
  }

  onFormCancel() {
    this.showForm = false;
    this.selectedUser = null;
  }

  async resetPassword(user: Utilisateur) {
    try {
      await this.userService.resetUserPassword(user.email);
      this.snackBar.open('Email de réinitialisation envoyé', 'Fermer', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Erreur lors de l\'envoi de l\'email', 'Fermer', { duration: 5000 });
    }
  }

  async toggleUserStatus(user: Utilisateur) {
    try {
      if (user.actif) {
        await this.userService.deactivateUser(user.uid);
      } else {
        await this.userService.activateUser(user.uid);
      }
      
      // Reload users
      await this.loadUsers();
      
      this.snackBar.open(
        `Utilisateur ${user.actif ? 'désactivé' : 'activé'}`, 
        'Fermer', 
        { duration: 3000 }
      );
    } catch (error) {
      this.snackBar.open('Erreur lors de la modification du statut', 'Fermer', { duration: 5000 });
    }
  }

  async deleteUser(user: Utilisateur) {
    // TODO: Add confirmation dialog
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom} ?`)) {
      try {
        await this.userService.deleteUser(user.uid);
        await this.loadUsers();
        this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 5000 });
      }
    }
  }
}