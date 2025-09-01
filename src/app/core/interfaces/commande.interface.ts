export interface Commande {
  id: string;
  numeroCommande: string;
  clientId: string;
  livreurId?: string;
  statut: StatutCommande;
  dateCreation: Date;
  dateModification: Date;
  dateLivraisonPrevue: Date;
  dateLivraisonReelle?: Date;
  
  // Adresses
  adresseEnlevement: Adresse;
  adresseLivraison: Adresse;
  
  // Détails commande
  articles: ArticleCommande[];
  poids: number;
  valeur: number;
  fragile: boolean;
  urgent: boolean;
  instructions?: string;
  
  // Tarification
  coutLivraison: number;
  pourboire?: number;
  total: number;
  methodePaiement: string;
  statutPaiement: StatutPaiement;
  
  // Suivi
  historiqueStatuts: HistoriqueStatut[];
  photos?: string[];
  signature?: string;
  commentaireLivreur?: string;
  commentaireClient?: string;
  noteClient?: number;
  noteLivreur?: number;
}

export type StatutCommande = 
  | 'nouvelle' 
  | 'confirmee' 
  | 'assignee' 
  | 'en_preparation' 
  | 'prete' 
  | 'en_cours' 
  | 'livree' 
  | 'annulee' 
  | 'retournee';

export type StatutPaiement = 'en_attente' | 'paye' | 'rembourse' | 'echec';

export interface ArticleCommande {
  id: string;
  nom: string;
  description?: string;
  quantite: number;
  prix: number;
  image?: string;
  categories: string[];
}

export interface HistoriqueStatut {
  statut: StatutCommande;
  timestamp: Date;
  utilisateurId: string;
  commentaire?: string;
  position?: Position;
}

export interface Adresse {
  id: string;
  nom: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  position: Position;
  instructions?: string;
  codeAcces?: string;
  etage?: string;
}

export interface Position {
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

export interface FiltresCommande {
  statuts?: StatutCommande[];
  dateDebut?: Date;
  dateFin?: Date;
  clientId?: string;
  livreurId?: string;
  urgent?: boolean;
  ville?: string;
  recherche?: string;
}