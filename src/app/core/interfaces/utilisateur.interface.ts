export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  avatar?: string;
  role: TypeRole;
  dateCreation: Date;
  dateModification: Date;
  actif: boolean;
}

export interface Admin extends Utilisateur {
  droitsAdmin: string[];
  dernierLogin: Date;
}

export interface Livreur extends Utilisateur {
  vehicule: TypeVehicule;
  plaqueImmatriculation: string;
  permisConduire: string;
  statutLivraison: StatutLivreur;
  positionActuelle?: Position;
  notesMoyennes: number;
  totalLivraisons: number;
  zonesLivraison: string[];
  disponible: boolean;
}

export interface Client extends Utilisateur {
  adressesPrincipales: Adresse[];
  historiqueCommandes: string[];
  preferencesNotifications: PreferencesNotifications;
}

export type TypeRole = 'admin' | 'livreur' | 'client';
export type TypeVehicule = 'voiture' | 'moto' | 'velo' | 'scooter';
export type StatutLivreur = 'disponible' | 'en_route' | 'en_pause' | 'hors_service';

export interface Position {
  latitude: number;
  longitude: number;
  timestamp: Date;
  precision?: number;
}

export interface Adresse {
  id: string;
  type: string;
  adresse: string;
  ville: string;
  codePostal: string;
  position: Position;
  instructions?: string;
  principale: boolean;
}

export interface PreferencesNotifications {
  email: boolean;
  push: boolean;
  sms: boolean;
  nouveauStatut: boolean;
  promotions: boolean;
}