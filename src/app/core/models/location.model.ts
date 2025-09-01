export interface Gouvernorat {
  id: string;
  nom: string;
  villes: Ville[];
}

export interface Ville {
  id: string;
  nom: string;
}

export interface TunisianLocations {
  gouvernorats: Gouvernorat[];
}