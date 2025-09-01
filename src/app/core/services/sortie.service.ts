import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, 
         getDocs, getDoc, query, where, orderBy, writeBatch } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sortie, CreateSortieRequest, UpdateSortieRequest, 
         SortieFilters, StatutSortie } from '../models/sortie.model';

@Injectable({
  providedIn: 'root'
})
export class SortieService {
  private sortiesCollection: any;

  constructor(private firestore: Firestore) {
    this.sortiesCollection = collection(this.firestore, 'sorties');
  }

  async createSortie(sortieData: CreateSortieRequest): Promise<Sortie> {
    const newSortie: Omit<Sortie, 'id'> = {
      numero: this.generateSortieNumber(),
      date: sortieData.date,
      livreurId: sortieData.livreurId,
      gouvernorat: sortieData.gouvernorat,
      villeDepart: sortieData.villeDepart,
      villesDesservies: sortieData.villesDesservies,
      commandeIds: sortieData.commandeIds,
      statut: 'planifiée',
      notes: sortieData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(this.sortiesCollection, newSortie);
    
    return {
      id: docRef.id,
      ...newSortie
    };
  }

  async getAllSorties(): Promise<Sortie[]> {
    const q = query(this.sortiesCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        date: data['date']?.toDate() || new Date(),
        heureDebut: data['heureDebut']?.toDate(),
        heureFin: data['heureFin']?.toDate(),
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Sortie;
    });
  }

  async getSortieById(id: string): Promise<Sortie | null> {
    const sortieDoc = doc(this.firestore, 'sorties', id);
    const docSnap = await getDoc(sortieDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      return {
        ...data,
        id: docSnap.id,
        date: data['date']?.toDate() || new Date(),
        heureDebut: data['heureDebut']?.toDate(),
        heureFin: data['heureFin']?.toDate(),
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Sortie;
    }
    
    return null;
  }

  async getSortiesByFilters(filters: SortieFilters): Promise<Sortie[]> {
    let q = query(this.sortiesCollection, orderBy('date', 'desc'));
    
    if (filters.livreurId) {
      q = query(this.sortiesCollection, where('livreurId', '==', filters.livreurId), orderBy('date', 'desc'));
    }
    
    if (filters.gouvernorat) {
      q = query(this.sortiesCollection, where('gouvernorat', '==', filters.gouvernorat), orderBy('date', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    let sorties = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        date: data['date']?.toDate() || new Date(),
        heureDebut: data['heureDebut']?.toDate(),
        heureFin: data['heureFin']?.toDate(),
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Sortie;
    });

    // Apply local filters
    if (filters.statut?.length) {
      sorties = sorties.filter(sortie => filters.statut!.includes(sortie.statut));
    }

    if (filters.dateDebut) {
      sorties = sorties.filter(sortie => sortie.date >= filters.dateDebut!);
    }

    if (filters.dateFin) {
      sorties = sorties.filter(sortie => sortie.date <= filters.dateFin!);
    }

    return sorties;
  }

  async updateSortie(id: string, updates: UpdateSortieRequest): Promise<void> {
    const sortieDoc = doc(this.firestore, 'sorties', id);
    await updateDoc(sortieDoc, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async updateSortieStatus(id: string, newStatus: StatutSortie): Promise<void> {
    const updates: UpdateSortieRequest = {
      statut: newStatus,
      updatedAt: new Date()
    } as any;

    // Add timestamps for specific status changes
    if (newStatus === 'en_route') {
      updates.heureDebut = new Date();
    } else if (newStatus === 'terminée') {
      updates.heureFin = new Date();
    }

    const sortieDoc = doc(this.firestore, 'sorties', id);
    await updateDoc(sortieDoc, updates as any);
  }

  async addCommandeToSortie(sortieId: string, commandeId: string): Promise<void> {
    const sortie = await this.getSortieById(sortieId);
    if (sortie) {
      const updatedCommandeIds = [...sortie.commandeIds, commandeId];
      await this.updateSortie(sortieId, { commandeIds: updatedCommandeIds });
    }
  }

  async removeCommandeFromSortie(sortieId: string, commandeId: string): Promise<void> {
    const sortie = await this.getSortieById(sortieId);
    if (sortie) {
      const updatedCommandeIds = sortie.commandeIds.filter(id => id !== commandeId);
      await this.updateSortie(sortieId, { commandeIds: updatedCommandeIds });
    }
  }

  async addCommandesToSortie(sortieId: string, commandeIds: string[]): Promise<void> {
    const sortie = await this.getSortieById(sortieId);
    if (sortie) {
      const updatedCommandeIds = [...new Set([...sortie.commandeIds, ...commandeIds])];
      await this.updateSortie(sortieId, { commandeIds: updatedCommandeIds });
    }
  }

  async deleteSortie(sortieId: string): Promise<void> {
    const sortieDoc = doc(this.firestore, 'sorties', sortieId);
    await deleteDoc(sortieDoc);
  }

  async getSortiesByDriver(livreurId: string): Promise<Sortie[]> {
    const q = query(
      this.sortiesCollection, 
      where('livreurId', '==', livreurId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        date: data['date']?.toDate() || new Date(),
        heureDebut: data['heureDebut']?.toDate(),
        heureFin: data['heureFin']?.toDate(),
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Sortie;
    });
  }

  async getSortiesByGovernorate(gouvernorat: string): Promise<Sortie[]> {
    const q = query(
      this.sortiesCollection, 
      where('gouvernorat', '==', gouvernorat),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        date: data['date']?.toDate() || new Date(),
        heureDebut: data['heureDebut']?.toDate(),
        heureFin: data['heureFin']?.toDate(),
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Sortie;
    });
  }

  async getSortiesStats(): Promise<{
    total: number;
    planifiée: number;
    en_route: number;
    terminée: number;
    annulée: number;
  }> {
    const querySnapshot = await getDocs(this.sortiesCollection);
    const sorties = querySnapshot.docs.map(doc => doc.data() as Sortie);
    
    return {
      total: sorties.length,
      planifiée: sorties.filter(s => s.statut === 'planifiée').length,
      en_route: sorties.filter(s => s.statut === 'en_route').length,
      terminée: sorties.filter(s => s.statut === 'terminée').length,
      annulée: sorties.filter(s => s.statut === 'annulée').length
    };
  }

  private generateSortieNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    
    return `SRT${year}${month}${day}${random}`;
  }
}