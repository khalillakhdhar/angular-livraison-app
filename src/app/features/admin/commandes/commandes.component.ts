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
import { MatDividerModule } from '@angular/material/divider';
import { 
  Commande, 
  CreateCommandeRequest, 
  UpdateCommandeRequest,
  TypeLivraison,
  EtatLivraison
} from '../../../core/models';
import { OrderService } from '../../../core/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommandeFormComponent } from './commande-form.component';

@Component({
  selector: 'app-commandes',
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
    MatDividerModule,
    CommandeFormComponent
  ],
  template: `
    <div class="commandes-container">
      <!-- Commande Form (shown when creating/editing) -->
      <app-commande-form
        *ngIf="showForm"
        [commande]="selectedCommande"
        (submit)="onFormSubmit($event)"
        (cancel)="onFormCancel()">
      </app-commande-form>

      <!-- Commandes List (shown when not creating/editing) -->
      <div *ngIf="!showForm" class="commandes-list">
        <div class="page-header">
          <h1>Gestion des Commandes</h1>
          <button mat-raised-button color="primary" (click)="createCommande()">
            <mat-icon>add_shopping_cart</mat-icon>
            Nouvelle commande
          </button>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Numéro, client...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [formControl]="typeFilter" multiple>
              <mat-option value="pickup">Pickup</mat-option>
              <mat-option value="livraison">Livraison</mat-option>
              <mat-option value="retour">Retour</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>État</mat-label>
            <mat-select [formControl]="etatFilter" multiple>
              <mat-option value="nouvelle">Nouvelle</mat-option>
              <mat-option value="assignée">Assignée</mat-option>
              <mat-option value="en_cours">En cours</mat-option>
              <mat-option value="livrée">Livrée</mat-option>
              <mat-option value="annulée">Annulée</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Effacer filtres
          </button>
        </div>

        <!-- Commandes Table -->
        <div class="table-container">
          <table mat-table [dataSource]="filteredCommandes" class="commandes-table" matSort>
            <!-- Numero Column -->
            <ng-container matColumnDef="numero">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Numéro</th>
              <td mat-cell *matCellDef="let commande">
                <div class="commande-numero">{{ commande.numero }}</div>
              </td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let commande">
                <mat-chip-set>
                  <mat-chip [class]="'type-' + commande.typeLivraison">
                    {{ commande.typeLivraison | titlecase }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Addresses Column -->
            <ng-container matColumnDef="addresses">
              <th mat-header-cell *matHeaderCellDef>Adresses</th>
              <td mat-cell *matCellDef="let commande">
                <div class="addresses-info">
                  <div class="pickup">
                    <strong>Pickup:</strong> {{ commande.pickupAdresse.ville }}
                  </div>
                  <div class="livraison">
                    <strong>Livraison:</strong> {{ commande.livraisonAdresse.ville }}
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- État Column -->
            <ng-container matColumnDef="etat">
              <th mat-header-cell *matHeaderCellDef>État</th>
              <td mat-cell *matCellDef="let commande">
                <mat-chip-set>
                  <mat-chip [class]="'etat-' + commande.etatLivraison.replace('_', '-')">
                    {{ getEtatLabel(commande.etatLivraison) }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Prix Column -->
            <ng-container matColumnDef="prix">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Prix</th>
              <td mat-cell *matCellDef="let commande">
                <div class="prix">{{ commande.prix | currency:'TND':'symbol':'1.2-2' }}</div>
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let commande">
                {{ commande.createdAt | date:'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let commande">
                <button mat-icon-button [matMenuTriggerFor]="commandeMenu" [matMenuTriggerData]="{commande: commande}">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="commande-row" (click)="viewCommande(row)"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
        </div>
      </div>
    </div>

    <!-- Commande Actions Menu -->
    <mat-menu #commandeMenu="matMenu">
      <ng-template matMenuContent let-commande="commande">
        <button mat-menu-item (click)="editCommande(commande)">
          <mat-icon>edit</mat-icon>
          <span>Modifier</span>
        </button>
        <button mat-menu-item (click)="assignLivreur(commande)">
          <mat-icon>person_add</mat-icon>
          <span>Assigner livreur</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="deleteCommande(commande)" class="danger-action">
          <mat-icon>delete</mat-icon>
          <span>Supprimer</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .commandes-container {
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
      color: #00ffff;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
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
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .commandes-table {
      width: 100%;
    }

    .commande-numero {
      font-weight: 600;
      color: #00ffff;
    }

    .addresses-info {
      font-size: 12px;
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

    /* Type chips */
    .type-pickup {
      background: #ff9800;
      color: white;
    }

    .type-livraison {
      background: #2196f3;
      color: white;
    }

    .type-retour {
      background: #9c27b0;
      color: white;
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

    .etat-en-cours {
      background: #ff9800;
      color: white;
    }

    .etat-livree {
      background: #4caf50;
      color: white;
    }

    .etat-annulee {
      background: #f44336;
      color: white;
    }

    .commande-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .commande-row:hover {
      background: rgba(0, 255, 255, 0.1);
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
export class CommandesComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'type', 'addresses', 'etat', 'prix', 'createdAt', 'actions'];
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];

  searchControl = new FormControl('');
  typeFilter = new FormControl<TypeLivraison[]>([]);
  etatFilter = new FormControl<EtatLivraison[]>([]);

  // Form state
  showForm = false;
  selectedCommande: Commande | null = null;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.setupFilters();
  }

  async ngOnInit() {
    await this.loadCommandes();
  }

  private setupFilters() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    this.typeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.etatFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private async loadCommandes() {
    try {
      this.commandes = await this.orderService.getAllOrders();
      this.applyFilters();
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 5000 });
    }
  }

  private applyFilters() {
    let filtered = [...this.commandes];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(commande => 
        commande.numero.toLowerCase().includes(searchTerm) ||
        commande.pickupAdresse.ville.toLowerCase().includes(searchTerm) ||
        commande.livraisonAdresse.ville.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    const selectedTypes = this.typeFilter.value || [];
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(commande => selectedTypes.includes(commande.typeLivraison));
    }

    // Apply état filter
    const selectedEtats = this.etatFilter.value || [];
    if (selectedEtats.length > 0) {
      filtered = filtered.filter(commande => selectedEtats.includes(commande.etatLivraison));
    }

    this.filteredCommandes = filtered;
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.typeFilter.setValue([]);
    this.etatFilter.setValue([]);
  }

  createCommande() {
    this.selectedCommande = null;
    this.showForm = true;
  }

  viewCommande(commande: Commande) {
    console.log('View commande:', commande);
    // TODO: Open commande details dialog or navigate to details page
  }

  editCommande(commande: Commande) {
    this.selectedCommande = commande;
    this.showForm = true;
  }

  async onFormSubmit(data: CreateCommandeRequest | UpdateCommandeRequest) {
    try {
      if (this.selectedCommande) {
        // Update existing commande
        await this.orderService.updateOrder(this.selectedCommande.id, data as UpdateCommandeRequest);
        this.snackBar.open('Commande modifiée avec succès', 'Fermer', { duration: 3000 });
      } else {
        // Create new commande
        await this.orderService.createOrder(data as CreateCommandeRequest);
        this.snackBar.open('Commande créée avec succès', 'Fermer', { duration: 3000 });
      }
      
      this.showForm = false;
      this.selectedCommande = null;
      await this.loadCommandes();
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
    this.selectedCommande = null;
  }

  assignLivreur(commande: Commande) {
    // TODO: Open assign livreur dialog
    console.log('Assign livreur to commande:', commande);
  }

  async deleteCommande(commande: Commande) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la commande ${commande.numero} ?`)) {
      try {
        await this.orderService.deleteOrder(commande.id);
        await this.loadCommandes();
        this.snackBar.open('Commande supprimée', 'Fermer', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 5000 });
      }
    }
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
}