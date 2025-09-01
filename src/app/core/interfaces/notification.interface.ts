export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: TypeNotification;
  destinataireId: string;
  statut: StatutNotification;
  dateCreation: Date;
  dateLecture?: Date;
  donnees?: any;
  priorite: PrioriteNotification;
  expire?: Date;
}

export type TypeNotification = 
  | 'nouvelle_commande'
  | 'commande_assignee'
  | 'statut_commande'
  | 'livraison_proche'
  | 'livraison_terminee'
  | 'paiement'
  | 'promotion'
  | 'systeme'
  | 'urgence';

export type StatutNotification = 'non_lue' | 'lue' | 'supprimee';
export type PrioriteNotification = 'basse' | 'normale' | 'haute' | 'critique';

export interface ParametresNotification {
  push: boolean;
  email: boolean;
  sms: boolean;
  son: boolean;
  vibration: boolean;
  heuresQuietes: {
    debut: string;
    fin: string;
  };
  types: {
    [key in TypeNotification]: boolean;
  };
}

export interface Statistiques {
  id: string;
  periode: PeriodeStats;
  dateDebut: Date;
  dateFin: Date;
  donnees: DonneesStats;
}

export type PeriodeStats = 'jour' | 'semaine' | 'mois' | 'trimestre' | 'annee';

export interface DonneesStats {
  // Statistiques générales
  totalCommandes: number;
  commandesLivrees: number;
  commandesAnnulees: number;
  tauxReussite: number;
  
  // Statistiques financières
  chiffreAffaires: number;
  recettesLivraison: number;
  pourboires: number;
  
  // Statistiques de performance
  tempsLivraisonMoyen: number;
  distanceMoyenne: number;
  notesMoyennes: number;
  
  // Statistiques par livreur (pour admin)
  statsLivreurs?: StatsLivreur[];
  
  // Statistiques par zone
  statsZones?: StatsZone[];
}

export interface StatsLivreur {
  livreurId: string;
  nom: string;
  totalLivraisons: number;
  tempsLivraisonMoyen: number;
  notesMoyennes: number;
  kilomettesParcourus: number;
  gains: number;
}

export interface StatsZone {
  zone: string;
  totalCommandes: number;
  tempsLivraisonMoyen: number;
  tauxReussite: number;
}

export interface IndicateurPerformance {
  nom: string;
  valeur: number;
  unite: string;
  tendance: 'hausse' | 'baisse' | 'stable';
  pourcentageChangement: number;
  couleur: string;
  icone: string;
}