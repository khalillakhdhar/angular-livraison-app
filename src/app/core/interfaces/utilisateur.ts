// Interface pour les utilisateurs de l'application
export interface Utilisateur {
  uid: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: 'admin' | 'livreur' | 'client';
  adresse?: string;
  photoURL?: string;
  actif: boolean;
  dateCreation: number;
  derniereConnexion: number;
}

// Interface pour les informations de profil livreur
export interface ProfilLivreur extends Utilisateur {
  role: 'livreur';
  vehicule?: {
    type: 'velo' | 'scooter' | 'voiture';
    marque?: string;
    modele?: string;
    immatriculation?: string;
  };
  zoneLivraison?: string[];
  nombreLivraisonsEffectuees: number;
  noteClient: number;
  disponible: boolean;
  positionActuelle?: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
}