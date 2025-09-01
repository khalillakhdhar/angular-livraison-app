export type TypeLivraison = 'pickup' | 'livraison' | 'retour';

export type EtatLivraison = 
  | 'nouvelle' 
  | 'assignée' 
  | 'en_cours' 
  | 'en_attente' 
  | 'retard' 
  | 'livrée' 
  | 'échouée' 
  | 'annulée' 
  | 'retour';

export interface Adresse {
  label: string;
  lat: number;
  lng: number;
  ville: string;
  gouvernorat: string;
  details?: string;
}

export interface Commande {
  id: string;
  numero: string;
  typeLivraison: TypeLivraison;
  pickupAdresse: Adresse;
  livraisonAdresse: Adresse;
  etatLivraison: EtatLivraison;
  prix: number;
  notes?: string;
  livreurId?: string;
  clientId: string;
  sortieId?: string;
  createdAt: Date;
  updatedAt: Date;
  demarrageAt?: Date;
  livraisonAt?: Date;
}

export interface CreateCommandeRequest {
  typeLivraison: TypeLivraison;
  pickupAdresse: Adresse;
  livraisonAdresse: Adresse;
  prix: number;
  notes?: string;
  clientId: string;
}

export interface UpdateCommandeRequest {
  typeLivraison?: TypeLivraison;
  pickupAdresse?: Adresse;
  livraisonAdresse?: Adresse;
  etatLivraison?: EtatLivraison;
  prix?: number;
  notes?: string;
  livreurId?: string;
  sortieId?: string;
  demarrageAt?: Date;
  livraisonAt?: Date;
  updatedAt?: Date;
}

export interface CommandeFilters {
  etatLivraison?: EtatLivraison[];
  typeLivraison?: TypeLivraison[];
  villeDepart?: string;
  gouvernoratDepart?: string;
  villeArrivee?: string;
  gouvernoratArrivee?: string;
  livreurId?: string;
  dateDebut?: Date;
  dateFin?: Date;
}