import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, 
         getDocs, getDoc, query, where, orderBy, writeBatch } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Commande, CreateCommandeRequest, UpdateCommandeRequest, 
         CommandeFilters, EtatLivraison, TypeLivraison } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection: any;

  constructor(private firestore: Firestore) {
    this.ordersCollection = collection(this.firestore, 'commandes');
  }

  async createOrder(orderData: CreateCommandeRequest): Promise<Commande> {
    const newOrder: Omit<Commande, 'id'> = {
      numero: this.generateOrderNumber(),
      typeLivraison: orderData.typeLivraison,
      pickupAdresse: orderData.pickupAdresse,
      livraisonAdresse: orderData.livraisonAdresse,
      etatLivraison: 'nouvelle',
      prix: orderData.prix,
      notes: orderData.notes,
      clientId: orderData.clientId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(this.ordersCollection, newOrder);
    
    return {
      id: docRef.id,
      ...newOrder
    };
  }

  async getAllOrders(): Promise<Commande[]> {
    const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        demarrageAt: data['demarrageAt']?.toDate(),
        livraisonAt: data['livraisonAt']?.toDate()
      } as Commande;
    });
  }

  async getOrderById(id: string): Promise<Commande | null> {
    const orderDoc = doc(this.firestore, 'commandes', id);
    const docSnap = await getDoc(orderDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      return {
        ...data,
        id: docSnap.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        demarrageAt: data['demarrageAt']?.toDate(),
        livraisonAt: data['livraisonAt']?.toDate()
      } as Commande;
    }
    
    return null;
  }

  async getOrdersByFilters(filters: CommandeFilters): Promise<Commande[]> {
    let q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
    
    if (filters.livreurId) {
      q = query(this.ordersCollection, where('livreurId', '==', filters.livreurId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    let orders = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        demarrageAt: data['demarrageAt']?.toDate(),
        livraisonAt: data['livraisonAt']?.toDate()
      } as Commande;
    });

    // Apply local filters
    if (filters.etatLivraison?.length) {
      orders = orders.filter(order => filters.etatLivraison!.includes(order.etatLivraison));
    }

    if (filters.typeLivraison?.length) {
      orders = orders.filter(order => filters.typeLivraison!.includes(order.typeLivraison));
    }

    if (filters.villeDepart) {
      orders = orders.filter(order => order.pickupAdresse.ville === filters.villeDepart);
    }

    if (filters.gouvernoratDepart) {
      orders = orders.filter(order => order.pickupAdresse.gouvernorat === filters.gouvernoratDepart);
    }

    if (filters.villeArrivee) {
      orders = orders.filter(order => order.livraisonAdresse.ville === filters.villeArrivee);
    }

    if (filters.gouvernoratArrivee) {
      orders = orders.filter(order => order.livraisonAdresse.gouvernorat === filters.gouvernoratArrivee);
    }

    if (filters.dateDebut) {
      orders = orders.filter(order => order.createdAt >= filters.dateDebut!);
    }

    if (filters.dateFin) {
      orders = orders.filter(order => order.createdAt <= filters.dateFin!);
    }

    return orders;
  }

  async updateOrder(id: string, updates: UpdateCommandeRequest): Promise<void> {
    const orderDoc = doc(this.firestore, 'commandes', id);
    await updateDoc(orderDoc, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async updateOrderStatus(id: string, newStatus: EtatLivraison): Promise<void> {
    const updates: UpdateCommandeRequest = {
      etatLivraison: newStatus,
      updatedAt: new Date()
    } as any;

    // Add timestamps for specific status changes
    if (newStatus === 'en_cours') {
      updates.demarrageAt = new Date();
    } else if (newStatus === 'livrée') {
      updates.livraisonAt = new Date();
    }

    const orderDoc = doc(this.firestore, 'commandes', id);
    await updateDoc(orderDoc, updates as any);
  }

  async assignOrderToDriver(orderId: string, livreurId: string): Promise<void> {
    await this.updateOrder(orderId, {
      livreurId,
      etatLivraison: 'assignée'
    });
  }

  async assignOrdersToDriver(orderIds: string[], livreurId: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    orderIds.forEach(orderId => {
      const orderDoc = doc(this.firestore, 'commandes', orderId);
      batch.update(orderDoc, {
        livreurId,
        etatLivraison: 'assignée',
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
  }

  async assignOrdersToSortie(orderIds: string[], sortieId: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    orderIds.forEach(orderId => {
      const orderDoc = doc(this.firestore, 'commandes', orderId);
      batch.update(orderDoc, {
        sortieId,
        etatLivraison: 'assignée',
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
  }

  async deleteOrder(id: string): Promise<void> {
    const orderDoc = doc(this.firestore, 'commandes', id);
    await deleteDoc(orderDoc);
  }

  async getOrdersByClient(clientId: string): Promise<Commande[]> {
    const q = query(
      this.ordersCollection, 
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        demarrageAt: data['demarrageAt']?.toDate(),
        livraisonAt: data['livraisonAt']?.toDate()
      } as Commande;
    });
  }

  async getOrdersByDriver(livreurId: string): Promise<Commande[]> {
    const q = query(
      this.ordersCollection, 
      where('livreurId', '==', livreurId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date(),
        demarrageAt: data['demarrageAt']?.toDate(),
        livraisonAt: data['livraisonAt']?.toDate()
      } as Commande;
    });
  }

  async getOrdersStats(): Promise<{
    total: number;
    nouvelle: number;
    assignée: number;
    en_cours: number;
    livrée: number;
    échouée: number;
  }> {
    const querySnapshot = await getDocs(this.ordersCollection);
    const orders = querySnapshot.docs.map(doc => doc.data() as Commande);
    
    return {
      total: orders.length,
      nouvelle: orders.filter(o => o.etatLivraison === 'nouvelle').length,
      assignée: orders.filter(o => o.etatLivraison === 'assignée').length,
      en_cours: orders.filter(o => o.etatLivraison === 'en_cours').length,
      livrée: orders.filter(o => o.etatLivraison === 'livrée').length,
      échouée: orders.filter(o => o.etatLivraison === 'échouée').length
    };
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `CMD${year}${month}${day}${random}`;
  }
}