// Interface pour les commandes de livraison
export interface Commande {
  id: string;
  clientId: string;
  livreurId?: string;
  statut: 'nouvelle' | 'en_cours' | 'livree' | 'annulee';
  numeroCommande: string;
  
  // Informations produits
  articles: ArticleCommande[];
  montantTotal: number;
  fraisLivraison: number;
  montantFinal: number;
  
  // Adresses
  adresseLivraison: Adresse;
  adresseEnlevement?: Adresse;
  
  // Timestamps
  dateCreation: number;
  dateAcceptation?: number;
  dateEnlevee?: number;
  dateLivraison?: number;
  
  // Instructions et notes
  instructionsLivraison?: string;
  notesLivreur?: string;
  
  // Suivi
  positionsLivreur?: PositionLivreur[];
  estimationLivraison?: number;
  
  // Évaluation
  noteClient?: number;
  commentaireClient?: string;
}

export interface ArticleCommande {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  description?: string;
}

export interface Adresse {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  latitude?: number;
  longitude?: number;
  complementAdresse?: string;
  etage?: string;
  codeAcces?: string;
}

export interface PositionLivreur {
  latitude: number;
  longitude: number;
  timestamp: number;
  vitesse?: number;
  precision?: number;
}

// Interface pour les statistiques de commandes
export interface StatistiquesCommandes {
  totalCommandes: number;
  commandesJour: number;
  commandesSemaine: number;
  commandesMois: number;
  revenusJour: number;
  revenusTotal: number;
  tempsLivraisonMoyen: number;
  satisfactionClient: number;
}