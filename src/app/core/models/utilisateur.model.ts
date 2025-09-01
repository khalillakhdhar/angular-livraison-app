export interface Utilisateur {
  uid: string;
  email: string;
  role: 'admin' | 'livreur' | 'client';
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  gouvernorat: string;
  photoURL?: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUtilisateurRequest {
  email: string;
  password: string;
  role: 'admin' | 'livreur' | 'client';
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  gouvernorat: string;
  actif?: boolean;
}

export interface UpdateUtilisateurRequest {
  role?: 'admin' | 'livreur' | 'client';
  nom?: string;
  prenom?: string;
  telephone?: string;
  ville?: string;
  gouvernorat?: string;
  photoURL?: string;
  actif?: boolean;
}