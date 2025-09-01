export type StatutLivreur = 'disponible' | 'en_livraison' | 'hors_ligne';

export interface PerformanceLivreur {
  nbLivraisons: number;
  tempsMoyenLivraison: number; // en minutes
  tauxReussite: number; // pourcentage
  noteClient: number; // sur 5
}

export interface Livreur {
  uid: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  gouvernorat: string;
  photoURL?: string;
  statut: StatutLivreur;
  zonesPreferees: string[]; // liste des gouvernorats
  performances: PerformanceLivreur;
  dernierePositionLat?: number;
  dernierePositionLng?: number;
  derniereConnexion?: Date;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLivreurRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  gouvernorat: string;
  zonesPreferees: string[];
  actif?: boolean;
}

export interface UpdateLivreurRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  ville?: string;
  gouvernorat?: string;
  photoURL?: string;
  statut?: StatutLivreur;
  zonesPreferees?: string[];
  dernierePositionLat?: number;
  dernierePositionLng?: number;
  derniereConnexion?: Date;
  performances?: PerformanceLivreur;
  actif?: boolean;
  updatedAt?: Date;
}