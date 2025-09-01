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
  Sortie, 
  CreateSortieRequest, 
  UpdateSortieRequest,
  StatutSortie
} from '../../../core/models';
import { SortieService, OrderService } from '../../../core/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SortieFormComponent } from './sortie-form.component';

@Component({
  selector: 'app-sorties',
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
    SortieFormComponent
  ],
  template: `
    <div class="sorties-container">
      <!-- Sortie Form (shown when creating/editing) -->
      <app-sortie-form
        *ngIf="showForm"
        [sortie]="selectedSortie"
        (submit)="onFormSubmit($event)"
        (cancel)="onFormCancel()">
      </app-sortie-form>

      <!-- Sorties List (shown when not creating/editing) -->
      <div *ngIf="!showForm" class="sorties-list">
        <div class="page-header">
          <h1>Gestion des Sorties</h1>
          <button mat-raised-button color="primary" (click)="createSortie()">
            <mat-icon>add_road</mat-icon>
            Nouvelle sortie
          </button>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Numéro, livreur...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [formControl]="statutFilter" multiple>
              <mat-option value="planifiée">Planifiée</mat-option>
              <mat-option value="en_route">En route</mat-option>
              <mat-option value="terminée">Terminée</mat-option>
              <mat-option value="annulée">Annulée</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Effacer filtres
          </button>
        </div>

        <!-- Sorties Table -->
        <div class="table-container">
          <table mat-table [dataSource]="filteredSorties" class="sorties-table" matSort>
            <!-- Numero Column -->
            <ng-container matColumnDef="numero">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Numéro</th>
              <td mat-cell *matCellDef="let sortie">
                <div class="sortie-numero">{{ sortie.numero }}</div>
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let sortie">
                {{ sortie.date | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <!-- Livreur Column -->
            <ng-container matColumnDef="livreur">
              <th mat-header-cell *matHeaderCellDef>Livreur</th>
              <td mat-cell *matCellDef="let sortie">
                <div class="livreur-info">
                  {{ getLivreurName(sortie.livreurId) }}
                </div>
              </td>
            </ng-container>

            <!-- Zone Column -->
            <ng-container matColumnDef="zone">
              <th mat-header-cell *matHeaderCellDef>Zone</th>
              <td mat-cell *matCellDef="let sortie">
                <div class="zone-info">
                  <div class="gouvernorat">{{ sortie.gouvernorat }}</div>
                  <div class="ville-depart">Départ: {{ sortie.villeDépart }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Commandes Column -->
            <ng-container matColumnDef="commandes">
              <th mat-header-cell *matHeaderCellDef>Commandes</th>
              <td mat-cell *matCellDef="let sortie">
                <div class="commandes-count">
                  <mat-icon>shopping_cart</mat-icon>
                  {{ sortie.commandeIds.length }}
                </div>
              </td>
            </ng-container>

            <!-- Statut Column -->
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let sortie">
                <mat-chip-set>
                  <mat-chip [class]="'statut-' + sortie.statut.replace('_', '-')">
                    {{ getStatutLabel(sortie.statut) }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let sortie">
                <button mat-icon-button [matMenuTriggerFor]="sortieMenu" [matMenuTriggerData]="{sortie: sortie}">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="sortie-row" (click)="viewSortie(row)"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
        </div>
      </div>
    </div>

    <!-- Sortie Actions Menu -->
    <mat-menu #sortieMenu="matMenu">
      <ng-template matMenuContent let-sortie="sortie">
        <button mat-menu-item (click)="editSortie(sortie)">
          <mat-icon>edit</mat-icon>
          <span>Modifier</span>
        </button>
        <button mat-menu-item (click)="startSortie(sortie)" [disabled]="sortie.statut !== 'planifiée'">
          <mat-icon>play_arrow</mat-icon>
          <span>Démarrer</span>
        </button>
        <button mat-menu-item (click)="finishSortie(sortie)" [disabled]="sortie.statut !== 'en_route'">
          <mat-icon>check_circle</mat-icon>
          <span>Terminer</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="exportPDF(sortie)">
          <mat-icon>picture_as_pdf</mat-icon>
          <span>Export PDF</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="deleteSortie(sortie)" class="danger-action">
          <mat-icon>delete</mat-icon>
          <span>Supprimer</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .sorties-container {
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

    .sorties-table {
      width: 100%;
    }

    .sortie-numero {
      font-weight: 600;
      color: #00ffff;
    }

    .livreur-info {
      font-weight: 500;
    }

    .zone-info {
      font-size: 12px;
    }

    .gouvernorat {
      font-weight: 500;
      color: #ff00ff;
    }

    .ville-depart {
      color: #666;
    }

    .commandes-count {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #00ff00;
      font-weight: 600;
    }

    /* Statut chips */
    .statut-planifiee {
      background: #2196f3;
      color: white;
    }

    .statut-en-route {
      background: #ff9800;
      color: white;
    }

    .statut-terminee {
      background: #4caf50;
      color: white;
    }

    .statut-annulee {
      background: #f44336;
      color: white;
    }

    .sortie-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .sortie-row:hover {
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
export class SortiesComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'date', 'livreur', 'zone', 'commandes', 'statut', 'actions'];
  sorties: Sortie[] = [];
  filteredSorties: Sortie[] = [];

  searchControl = new FormControl('');
  statutFilter = new FormControl<StatutSortie[]>([]);

  // Form state
  showForm = false;
  selectedSortie: Sortie | null = null;

  // Cache for livreur names
  livreursMap = new Map<string, string>();

  constructor(
    private sortieService: SortieService,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.setupFilters();
  }

  async ngOnInit() {
    await this.loadSorties();
  }

  private setupFilters() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    this.statutFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private async loadSorties() {
    try {
      this.sorties = await this.sortieService.getAllSorties();
      this.applyFilters();
    } catch (error) {
      this.snackBar.open('Erreur lors du chargement des sorties', 'Fermer', { duration: 5000 });
    }
  }

  private applyFilters() {
    let filtered = [...this.sorties];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(sortie => 
        sortie.numero.toLowerCase().includes(searchTerm) ||
        sortie.gouvernorat.toLowerCase().includes(searchTerm) ||
        sortie.villeDépart.toLowerCase().includes(searchTerm)
      );
    }

    // Apply statut filter
    const selectedStatuts = this.statutFilter.value || [];
    if (selectedStatuts.length > 0) {
      filtered = filtered.filter(sortie => selectedStatuts.includes(sortie.statut));
    }

    this.filteredSorties = filtered;
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.statutFilter.setValue([]);
  }

  createSortie() {
    this.selectedSortie = null;
    this.showForm = true;
  }

  viewSortie(sortie: Sortie) {
    console.log('View sortie:', sortie);
    // TODO: Open sortie details dialog or navigate to details page
  }

  editSortie(sortie: Sortie) {
    this.selectedSortie = sortie;
    this.showForm = true;
  }

  async onFormSubmit(data: CreateSortieRequest | UpdateSortieRequest) {
    try {
      if (this.selectedSortie) {
        // Update existing sortie
        await this.sortieService.updateSortie(this.selectedSortie.id, data as UpdateSortieRequest);
        this.snackBar.open('Sortie modifiée avec succès', 'Fermer', { duration: 3000 });
      } else {
        // Create new sortie
        const newSortie = await this.sortieService.createSortie(data as CreateSortieRequest);
        
        // Link commandes to sortie
        if (data.commandeIds.length > 0) {
          await this.orderService.linkOrdersToSortie(data.commandeIds, newSortie.id);
        }
        
        this.snackBar.open('Sortie créée avec succès', 'Fermer', { duration: 3000 });
      }
      
      this.showForm = false;
      this.selectedSortie = null;
      await this.loadSorties();
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
    this.selectedSortie = null;
  }

  async startSortie(sortie: Sortie) {
    try {
      await this.sortieService.updateSortie(sortie.id, { 
        statut: 'en_route',
        heureDebut: new Date()
      });
      await this.loadSorties();
      this.snackBar.open('Sortie démarrée', 'Fermer', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Erreur lors du démarrage', 'Fermer', { duration: 5000 });
    }
  }

  async finishSortie(sortie: Sortie) {
    try {
      await this.sortieService.updateSortie(sortie.id, { 
        statut: 'terminée',
        heureFin: new Date()
      });
      await this.loadSorties();
      this.snackBar.open('Sortie terminée', 'Fermer', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Erreur lors de la finalisation', 'Fermer', { duration: 5000 });
    }
  }

  exportPDF(sortie: Sortie) {
    // TODO: Implement PDF export
    this.snackBar.open('Export PDF - À implémenter', 'Fermer', { duration: 3000 });
  }

  async deleteSortie(sortie: Sortie) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la sortie ${sortie.numero} ?`)) {
      try {
        await this.sortieService.deleteSortie(sortie.id);
        await this.loadSorties();
        this.snackBar.open('Sortie supprimée', 'Fermer', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 5000 });
      }
    }
  }

  getLivreurName(livreurId: string): string {
    // TODO: Load livreur names from user service
    return this.livreursMap.get(livreurId) || 'Livreur inconnu';
  }

  getStatutLabel(statut: StatutSortie): string {
    const labels: Record<StatutSortie, string> = {
      'planifiée': 'Planifiée',
      'en_route': 'En route',
      'terminée': 'Terminée',
      'annulée': 'Annulée'
    };
    return labels[statut] || statut;
  }
}