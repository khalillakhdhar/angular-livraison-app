export type StatutSortie = 'planifiée' | 'en_route' | 'terminée' | 'annulée';

export interface Sortie {
  id: string;
  numero: string;
  date: Date;
  livreurId: string;
  gouvernorat: string;
  villeDépart: string;
  villesDesservies: string[];
  commandeIds: string[];
  statut: StatutSortie;
  heureDebut?: Date;
  heureFin?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSortieRequest {
  date: Date;
  livreurId: string;
  gouvernorat: string;
  villeDépart: string;
  villesDesservies: string[];
  commandeIds: string[];
  notes?: string;
}

export interface UpdateSortieRequest {
  date?: Date;
  livreurId?: string;
  gouvernorat?: string;
  villeDépart?: string;
  villesDesservies?: string[];
  commandeIds?: string[];
  statut?: StatutSortie;
  heureDebut?: Date;
  heureFin?: Date;
  notes?: string;
  updatedAt?: Date;
}

export interface SortieFilters {
  statut?: StatutSortie[];
  livreurId?: string;
  gouvernorat?: string;
  dateDebut?: Date;
  dateFin?: Date;
}