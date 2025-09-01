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
  templateUrl: './admin-dashboard.component.html',
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