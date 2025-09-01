import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, getDocs, getDoc, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Commande, StatistiquesCommandes, PositionLivreur } from '../interfaces/commande';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Commande[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  // Créer une nouvelle commande
  async createOrder(orderData: Omit<Commande, 'id' | 'dateCreation' | 'numeroCommande'>): Promise<string | null> {
    try {
      const ordersRef = collection(this.firestore, 'commandes');
      
      // Générer un numéro de commande unique
      const numeroCommande = this.generateOrderNumber();
      
      const newOrder = {
        ...orderData,
        numeroCommande,
        dateCreation: serverTimestamp(),
        statut: 'nouvelle' as const
      };

      const docRef = await addDoc(ordersRef, newOrder);
      
      this.notificationService.showSuccess('Commande créée avec succès');
      return docRef.id;
    } catch (error) {
      console.error('Erreur création commande:', error);
      this.notificationService.showError('Erreur lors de la création de la commande');
      return null;
    }
  }

  // Récupérer toutes les commandes (pour admin)
  getAllOrders(): Observable<Commande[]> {
    const ordersRef = collection(this.firestore, 'commandes');
    const q = query(ordersRef, orderBy('dateCreation', 'desc'));

    return new Observable<Commande[]>(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateCreation: this.timestampToMillis(doc.data()['dateCreation']),
          dateAcceptation: this.timestampToMillis(doc.data()['dateAcceptation']),
          dateEnlevee: this.timestampToMillis(doc.data()['dateEnlevee']),
          dateLivraison: this.timestampToMillis(doc.data()['dateLivraison'])
        })) as Commande[];
        
        this.ordersSubject.next(orders);
        observer.next(orders);
      });

      return unsubscribe;
    });
  }

  // Récupérer les commandes d'un client
  getOrdersByClient(clientId: string): Observable<Commande[]> {
    const ordersRef = collection(this.firestore, 'commandes');
    const q = query(
      ordersRef, 
      where('clientId', '==', clientId),
      orderBy('dateCreation', 'desc')
    );

    return new Observable<Commande[]>(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateCreation: this.timestampToMillis(doc.data()['dateCreation']),
          dateAcceptation: this.timestampToMillis(doc.data()['dateAcceptation']),
          dateEnlevee: this.timestampToMillis(doc.data()['dateEnlevee']),
          dateLivraison: this.timestampToMillis(doc.data()['dateLivraison'])
        })) as Commande[];
        
        observer.next(orders);
      });

      return unsubscribe;
    });
  }

  // Récupérer les commandes d'un livreur
  getOrdersByDelivery(livreurId: string): Observable<Commande[]> {
    const ordersRef = collection(this.firestore, 'commandes');
    const q = query(
      ordersRef,
      where('livreurId', '==', livreurId),
      orderBy('dateCreation', 'desc')
    );

    return new Observable<Commande[]>(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateCreation: this.timestampToMillis(doc.data()['dateCreation']),
          dateAcceptation: this.timestampToMillis(doc.data()['dateAcceptation']),
          dateEnlevee: this.timestampToMillis(doc.data()['dateEnlevee']),
          dateLivraison: this.timestampToMillis(doc.data()['dateLivraison'])
        })) as Commande[];
        
        observer.next(orders);
      });

      return unsubscribe;
    });
  }

  // Récupérer les commandes disponibles (sans livreur assigné)
  getAvailableOrders(): Observable<Commande[]> {
    const ordersRef = collection(this.firestore, 'commandes');
    const q = query(
      ordersRef,
      where('statut', '==', 'nouvelle'),
      where('livreurId', '==', null),
      orderBy('dateCreation', 'desc')
    );

    return new Observable<Commande[]>(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateCreation: this.timestampToMillis(doc.data()['dateCreation']),
          dateAcceptation: this.timestampToMillis(doc.data()['dateAcceptation']),
          dateEnlevee: this.timestampToMillis(doc.data()['dateEnlevee']),
          dateLivraison: this.timestampToMillis(doc.data()['dateLivraison'])
        })) as Commande[];
        
        observer.next(orders);
      });

      return unsubscribe;
    });
  }

  // Assigner un livreur à une commande
  async assignDelivery(orderId: string, livreurId: string): Promise<boolean> {
    try {
      const orderRef = doc(this.firestore, 'commandes', orderId);
      await updateDoc(orderRef, {
        livreurId,
        statut: 'en_cours',
        dateAcceptation: serverTimestamp()
      });

      this.notificationService.showSuccess('Livreur assigné avec succès');
      return true;
    } catch (error) {
      console.error('Erreur assignation livreur:', error);
      this.notificationService.showError('Erreur lors de l\'assignation du livreur');
      return false;
    }
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId: string, newStatus: Commande['statut']): Promise<boolean> {
    try {
      const orderRef = doc(this.firestore, 'commandes', orderId);
      const updateData: any = { statut: newStatus };

      // Ajouter les timestamps selon le statut
      switch (newStatus) {
        case 'en_cours':
          updateData.dateAcceptation = serverTimestamp();
          break;
        case 'livree':
          updateData.dateLivraison = serverTimestamp();
          break;
      }

      await updateDoc(orderRef, updateData);

      const statusMessages = {
        'nouvelle': 'Commande remise en attente',
        'en_cours': 'Commande acceptée par le livreur',
        'livree': 'Commande marquée comme livrée',
        'annulee': 'Commande annulée'
      };

      this.notificationService.showSuccess(statusMessages[newStatus]);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      this.notificationService.showError('Erreur lors de la mise à jour du statut');
      return false;
    }
  }

  // Mettre à jour la position du livreur pour une commande
  async updateDeliveryPosition(orderId: string, position: PositionLivreur): Promise<boolean> {
    try {
      const orderRef = doc(this.firestore, 'commandes', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        return false;
      }

      const orderData = orderDoc.data() as Commande;
      const currentPositions = orderData.positionsLivreur || [];
      
      await updateDoc(orderRef, {
        positionsLivreur: [...currentPositions, {
          ...position,
          timestamp: Date.now()
        }]
      });

      return true;
    } catch (error) {
      console.error('Erreur mise à jour position:', error);
      return false;
    }
  }

  // Récupérer une commande spécifique
  async getOrder(orderId: string): Promise<Commande | null> {
    try {
      const orderRef = doc(this.firestore, 'commandes', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (orderDoc.exists()) {
        const data = orderDoc.data();
        return {
          id: orderDoc.id,
          ...data,
          dateCreation: this.timestampToMillis(data['dateCreation']),
          dateAcceptation: this.timestampToMillis(data['dateAcceptation']),
          dateEnlevee: this.timestampToMillis(data['dateEnlevee']),
          dateLivraison: this.timestampToMillis(data['dateLivraison'])
        } as Commande;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur récupération commande:', error);
      return null;
    }
  }

  // Supprimer une commande
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const orderRef = doc(this.firestore, 'commandes', orderId);
      await deleteDoc(orderRef);
      
      this.notificationService.showSuccess('Commande supprimée');
      return true;
    } catch (error) {
      console.error('Erreur suppression commande:', error);
      this.notificationService.showError('Erreur lors de la suppression');
      return false;
    }
  }

  // Récupérer les statistiques des commandes
  async getOrdersStatistics(): Promise<StatistiquesCommandes> {
    try {
      const ordersRef = collection(this.firestore, 'commandes');
      const snapshot = await getDocs(ordersRef);
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateCreation: this.timestampToMillis(doc.data()['dateCreation']),
        dateLivraison: this.timestampToMillis(doc.data()['dateLivraison'])
      })) as Commande[];

      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

      const commandesJour = orders.filter(o => o.dateCreation >= oneDayAgo).length;
      const commandesSemaine = orders.filter(o => o.dateCreation >= oneWeekAgo).length;
      const commandesMois = orders.filter(o => o.dateCreation >= oneMonthAgo).length;

      const revenusJour = orders
        .filter(o => o.dateCreation >= oneDayAgo && o.statut === 'livree')
        .reduce((sum, o) => sum + o.montantFinal, 0);

      const revenusTotal = orders
        .filter(o => o.statut === 'livree')
        .reduce((sum, o) => sum + o.montantFinal, 0);

      const ordersWithDeliveryTime = orders.filter(o => 
        o.dateLivraison && o.dateAcceptation && o.statut === 'livree'
      );

      const tempsLivraisonMoyen = ordersWithDeliveryTime.length > 0
        ? ordersWithDeliveryTime.reduce((sum, o) => 
            sum + (o.dateLivraison! - o.dateAcceptation!), 0
          ) / ordersWithDeliveryTime.length / (1000 * 60) // en minutes
        : 0;

      const ordersWithRating = orders.filter(o => o.noteClient);
      const satisfactionClient = ordersWithRating.length > 0
        ? ordersWithRating.reduce((sum, o) => sum + (o.noteClient || 0), 0) / ordersWithRating.length
        : 0;

      return {
        totalCommandes: orders.length,
        commandesJour,
        commandesSemaine,
        commandesMois,
        revenusJour,
        revenusTotal,
        tempsLivraisonMoyen: Math.round(tempsLivraisonMoyen),
        satisfactionClient: Math.round(satisfactionClient * 100) / 100
      };
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      return {
        totalCommandes: 0,
        commandesJour: 0,
        commandesSemaine: 0,
        commandesMois: 0,
        revenusJour: 0,
        revenusTotal: 0,
        tempsLivraisonMoyen: 0,
        satisfactionClient: 0
      };
    }
  }

  // Générer un numéro de commande unique
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-6);
    
    return `CMD${year}${month}${day}${time}`;
  }

  // Convertir Timestamp Firestore en millisecondes
  private timestampToMillis(timestamp: any): number {
    if (!timestamp) return 0;
    if (timestamp instanceof Timestamp) {
      return timestamp.toMillis();
    }
    if (typeof timestamp === 'object' && timestamp.seconds) {
      return timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    }
    return timestamp;
  }
}