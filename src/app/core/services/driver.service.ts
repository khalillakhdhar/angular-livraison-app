import { Injectable } from '@angular/core';
import { Firestore, collection, doc, updateDoc, getDocs, getDoc, 
         query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Livreur, CreateLivreurRequest, UpdateLivreurRequest, 
         StatutLivreur, PerformanceLivreur } from '../models/livreur.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private usersCollection: any;

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async createDriver(driverData: CreateLivreurRequest): Promise<Livreur> {
    // Create user with 'livreur' role
    const userData = {
      ...driverData,
      role: 'livreur' as const
    };
    
    const user = await this.userService.createUser(userData);
    
    // Initialize driver-specific data
    const livreur: Livreur = {
      ...user,
      statut: 'hors_ligne',
      zonesPreferees: driverData.zonesPreferees,
      performances: {
        nbLivraisons: 0,
        tempsMoyenLivraison: 0,
        tauxReussite: 0,
        noteClient: 0
      },
      actif: driverData.actif ?? true,
      createdAt: user.createdAt,
      updatedAt: new Date()
    };

    // Update with driver-specific fields
    await this.updateDriver(user.uid, {
      statut: 'hors_ligne',
      zonesPreferees: driverData.zonesPreferees
    });

    return livreur;
  }

  async getAllDrivers(): Promise<Livreur[]> {
    const q = query(
      this.usersCollection, 
      where('role', '==', 'livreur'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        performances: data['performances'] || {
          nbLivraisons: 0,
          tempsMoyenLivraison: 0,
          tauxReussite: 0,
          noteClient: 0
        },
        zonesPreferees: data['zonesPreferees'] || [],
        statut: data['statut'] || 'hors_ligne',
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        derniereConnexion: data['derniereConnexion']?.toDate()
      } as Livreur;
    });
  }

  async getDriverById(uid: string): Promise<Livreur | null> {
    const userDoc = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      if (data['role'] !== 'livreur') return null;
      
      return {
        ...data,
        uid: docSnap.id,
        performances: data['performances'] || {
          nbLivraisons: 0,
          tempsMoyenLivraison: 0,
          tauxReussite: 0,
          noteClient: 0
        },
        zonesPreferees: data['zonesPreferees'] || [],
        statut: data['statut'] || 'hors_ligne',
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        derniereConnexion: data['derniereConnexion']?.toDate()
      } as Livreur;
    }
    
    return null;
  }

  async getDriversByStatus(statut: StatutLivreur): Promise<Livreur[]> {
    const q = query(
      this.usersCollection,
      where('role', '==', 'livreur'),
      where('statut', '==', statut),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        performances: data['performances'] || {
          nbLivraisons: 0,
          tempsMoyenLivraison: 0,
          tauxReussite: 0,
          noteClient: 0
        },
        zonesPreferees: data['zonesPreferees'] || [],
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        derniereConnexion: data['derniereConnexion']?.toDate()
      } as Livreur;
    });
  }

  async getDriversByZone(gouvernorat: string): Promise<Livreur[]> {
    const allDrivers = await this.getAllDrivers();
    return allDrivers.filter(driver => 
      driver.zonesPreferees.includes(gouvernorat) || driver.gouvernorat === gouvernorat
    );
  }

  async getAvailableDrivers(): Promise<Livreur[]> {
    return this.getDriversByStatus('disponible');
  }

  async updateDriver(uid: string, updates: UpdateLivreurRequest): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async updateDriverStatus(uid: string, statut: StatutLivreur): Promise<void> {
    const updates: UpdateLivreurRequest = {
      statut,
      derniereConnexion: new Date()
    };

    await this.updateDriver(uid, updates);
  }

  async updateDriverPosition(uid: string, lat: number, lng: number): Promise<void> {
    await this.updateDriver(uid, {
      dernierePositionLat: lat,
      dernierePositionLng: lng
    });
  }

  async updateDriverPerformances(uid: string, performances: PerformanceLivreur): Promise<void> {
    await this.updateDriver(uid, { performances });
  }

  async activateDriver(uid: string): Promise<void> {
    await this.updateDriver(uid, { actif: true });
  }

  async deactivateDriver(uid: string): Promise<void> {
    await this.updateDriver(uid, { 
      actif: false,
      statut: 'hors_ligne'
    });
  }

  async addPreferredZone(uid: string, gouvernorat: string): Promise<void> {
    const driver = await this.getDriverById(uid);
    if (driver && !driver.zonesPreferees.includes(gouvernorat)) {
      const updatedZones = [...driver.zonesPreferees, gouvernorat];
      await this.updateDriver(uid, { zonesPreferees: updatedZones });
    }
  }

  async removePreferredZone(uid: string, gouvernorat: string): Promise<void> {
    const driver = await this.getDriverById(uid);
    if (driver) {
      const updatedZones = driver.zonesPreferees.filter(zone => zone !== gouvernorat);
      await this.updateDriver(uid, { zonesPreferees: updatedZones });
    }
  }

  async searchDrivers(searchTerm: string): Promise<Livreur[]> {
    const allDrivers = await this.getAllDrivers();
    
    if (!searchTerm) return allDrivers;
    
    const term = searchTerm.toLowerCase();
    return allDrivers.filter(driver => 
      driver.nom.toLowerCase().includes(term) ||
      driver.prenom.toLowerCase().includes(term) ||
      driver.email.toLowerCase().includes(term) ||
      driver.telephone.includes(term) ||
      driver.ville.toLowerCase().includes(term) ||
      driver.gouvernorat.toLowerCase().includes(term)
    );
  }

  async getDriversStats(): Promise<{
    total: number;
    disponible: number;
    en_livraison: number;
    hors_ligne: number;
    actifs: number;
  }> {
    const drivers = await this.getAllDrivers();
    
    return {
      total: drivers.length,
      disponible: drivers.filter(d => d.statut === 'disponible').length,
      en_livraison: drivers.filter(d => d.statut === 'en_livraison').length,
      hors_ligne: drivers.filter(d => d.statut === 'hors_ligne').length,
      actifs: drivers.filter(d => d.actif).length
    };
  }

  async getTopPerformers(limit: number = 10): Promise<Livreur[]> {
    const drivers = await this.getAllDrivers();
    
    return drivers
      .filter(driver => driver.performances.nbLivraisons > 0)
      .sort((a, b) => {
        // Sort by success rate and then by number of deliveries
        const scoreA = a.performances.tauxReussite * 0.6 + (a.performances.nbLivraisons / 100) * 0.4;
        const scoreB = b.performances.tauxReussite * 0.6 + (b.performances.nbLivraisons / 100) * 0.4;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}