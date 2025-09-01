import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services/commande.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

interface KPI {
  titre: string;
  valeur: number | string;
  unite: string;
  icone: string;
  couleur: string;
  tendance: 'hausse' | 'baisse' | 'stable';
  pourcentage: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="dashboard-title">Tableau de Bord Admin</h1>
            <p class="dashboard-subtitle">Bienvenue dans votre espace d'administration</p>
          </div>
          <div class="header-actions">
            <div class="notifications-badge" *ngIf="compteurNotifications > 0">
              <span class="badge">{{ compteurNotifications }}</span>
              <span class="notification-icon">🔔</span>
            </div>
            <button class="btn-logout" (click)="seDeconnecter()">
              <span>🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <!-- KPIs Section -->
      <section class="kpis-section">
        <h2 class="section-title">Indicateurs Clés</h2>
        <div class="kpis-grid">
          <div class="kpi-card" *ngFor="let kpi of kpis" [class]="'kpi-' + kpi.couleur">
            <div class="kpi-header">
              <span class="kpi-icon">{{ kpi.icone }}</span>
              <div class="kpi-tendance" [class]="'tendance-' + kpi.tendance">
                <span class="tendance-icon">
                  {{ kpi.tendance === 'hausse' ? '📈' : kpi.tendance === 'baisse' ? '📉' : '➡️' }}
                </span>
                <span class="tendance-valeur">{{ kpi.pourcentage }}%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-valeur">{{ kpi.valeur }}<span class="kpi-unite">{{ kpi.unite }}</span></div>
              <div class="kpi-titre">{{ kpi.titre }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2 class="section-title">Actions Rapides</h2>
        <div class="actions-grid">
          <button class="action-card" routerLink="/admin/commandes">
            <div class="action-icon">📦</div>
            <div class="action-content">
              <h3>Gérer les Commandes</h3>
              <p>{{ statistiques?.nouvelles || 0 }} nouvelles commandes</p>
            </div>
          </button>
          
          <button class="action-card" routerLink="/admin/livreurs">
            <div class="action-icon">🚛</div>
            <div class="action-content">
              <h3>Gérer les Livreurs</h3>
              <p>{{ livreursActifs }} livreurs actifs</p>
            </div>
          </button>
          
          <button class="action-card" routerLink="/admin/analytics">
            <div class="action-icon">📊</div>
            <div class="action-content">
              <h3>Analytics</h3>
              <p>Rapports détaillés</p>
            </div>
          </button>
          
          <button class="action-card" routerLink="/admin/clients">
            <div class="action-icon">👥</div>
            <div class="action-content">
              <h3>Clients</h3>
              <p>Base de données clients</p>
            </div>
          </button>
        </div>
      </section>

      <!-- Recent Orders -->
      <section class="recent-orders-section">
        <div class="section-header">
          <h2 class="section-title">Commandes Récentes</h2>
          <button class="btn-voir-tout" routerLink="/admin/commandes">Voir tout</button>
        </div>
        <div class="orders-table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let commande of commandesRecentes" class="order-row">
                <td class="numero-commande">{{ commande.numeroCommande }}</td>
                <td>{{ commande.adresseLivraison.nom }}</td>
                <td>
                  <span class="statut-badge" [class]="'statut-' + commande.statut">
                    {{ getStatutLabel(commande.statut) }}
                  </span>
                </td>
                <td class="montant">{{ commande.total }}€</td>
                <td>{{ commande.dateCreation | date:'short':'fr' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action btn-view" title="Voir détails">👁️</button>
                    <button class="btn-action btn-edit" title="Modifier">✏️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="quick-stats-section">
        <h2 class="section-title">Statistiques Rapides</h2>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-circle cyan">
              <span class="stat-percentage">{{ tauxReussite }}%</span>
            </div>
            <div class="stat-label">Taux de Réussite</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-circle magenta">
              <span class="stat-percentage">{{ tempsLivraisonMoyen }}min</span>
            </div>
            <div class="stat-label">Temps Moyen</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-circle green">
              <span class="stat-percentage">{{ satisfactionClient }}%</span>
            </div>
            <div class="stat-label">Satisfaction</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private commandeService = inject(CommandeService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  kpis: KPI[] = [];
  statistiques: any = {};
  commandesRecentes: any[] = [];
  compteurNotifications = 0;
  livreursActifs = 12;
  tauxReussite = 94;
  tempsLivraisonMoyen = 28;
  satisfactionClient = 89;

  ngOnInit() {
    this.chargerStatistiques();
    this.chargerCommandesRecentes();
    this.chargerNotifications();
    this.initialiserKPIs();
  }

  chargerStatistiques() {
    this.commandeService.obtenirStatistiques().subscribe(stats => {
      this.statistiques = stats;
      this.mettreAJourKPIs();
    });
  }

  chargerCommandesRecentes() {
    this.commandeService.obtenirCommandes().subscribe(commandes => {
      this.commandesRecentes = commandes.slice(0, 5);
    });
  }

  chargerNotifications() {
    this.notificationService.obtenirNombreNonLues('admin').subscribe(count => {
      this.compteurNotifications = count;
    });
  }

  initialiserKPIs() {
    this.kpis = [
      {
        titre: 'Commandes Totales',
        valeur: 0,
        unite: '',
        icone: '📦',
        couleur: 'cyan',
        tendance: 'hausse',
        pourcentage: 12
      },
      {
        titre: 'En Cours',
        valeur: 0,
        unite: '',
        icone: '🚛',
        couleur: 'magenta',
        tendance: 'stable',
        pourcentage: 0
      },
      {
        titre: 'Chiffre d\'Affaires',
        valeur: 0,
        unite: '€',
        icone: '💰',
        couleur: 'green',
        tendance: 'hausse',
        pourcentage: 8
      },
      {
        titre: 'Commandes Urgentes',
        valeur: 0,
        unite: '',
        icone: '⚡',
        couleur: 'orange',
        tendance: 'baisse',
        pourcentage: -5
      }
    ];
  }

  mettreAJourKPIs() {
    if (this.statistiques) {
      this.kpis[0].valeur = this.statistiques.total;
      this.kpis[1].valeur = this.statistiques.enCours;
      this.kpis[2].valeur = this.statistiques.chiffreAffairesMois;
      this.kpis[3].valeur = this.statistiques.urgentes;
      this.tauxReussite = this.statistiques.tauxReussite;
    }
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'nouvelle': 'Nouvelle',
      'confirmee': 'Confirmée',
      'assignee': 'Assignée',
      'en_preparation': 'En préparation',
      'prete': 'Prête',
      'en_cours': 'En cours',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[statut] || statut;
  }

  seDeconnecter() {
    this.authService.deconnecter();
  }
}