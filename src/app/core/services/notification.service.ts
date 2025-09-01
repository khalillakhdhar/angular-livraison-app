import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Notification, TypeNotification, StatutNotification, PrioriteNotification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private compteurNonLues = new BehaviorSubject<number>(0);
  public compteurNonLues$ = this.compteurNonLues.asObservable();

  constructor() {
    this.genererNotificationsDemo();
  }

  /**
   * Créer une nouvelle notification
   */
  creerNotification(
    titre: string,
    message: string,
    type: TypeNotification,
    destinataireId: string,
    priorite: PrioriteNotification = 'normale',
    donnees?: any
  ): Observable<Notification> {
    const notification: Notification = {
      id: this.genererUUID(),
      titre,
      message,
      type,
      destinataireId,
      statut: 'non_lue',
      dateCreation: new Date(),
      priorite,
      donnees
    };

    const notifications = this.notificationsSubject.value;
    notifications.unshift(notification);
    this.notificationsSubject.next(notifications);
    
    this.mettreAJourCompteur();
    return of(notification);
  }

  /**
   * Marquer une notification comme lue
   */
  marquerCommeLue(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === notificationId);

    if (index !== -1 && notifications[index].statut === 'non_lue') {
      notifications[index].statut = 'lue';
      notifications[index].dateLecture = new Date();
      this.notificationsSubject.next(notifications);
      this.mettreAJourCompteur();
      return of(true);
    }

    return of(false);
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  marquerToutesCommeLues(destinataireId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    let modifie = false;

    notifications.forEach(notification => {
      if (notification.destinataireId === destinataireId && notification.statut === 'non_lue') {
        notification.statut = 'lue';
        notification.dateLecture = new Date();
        modifie = true;
      }
    });

    if (modifie) {
      this.notificationsSubject.next(notifications);
      this.mettreAJourCompteur();
    }

    return of(modifie);
  }

  /**
   * Supprimer une notification
   */
  supprimerNotification(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === notificationId);

    if (index !== -1) {
      notifications.splice(index, 1);
      this.notificationsSubject.next(notifications);
      this.mettreAJourCompteur();
      return of(true);
    }

    return of(false);
  }

  /**
   * Obtenir notifications pour un utilisateur
   */
  obtenirNotificationsPourUtilisateur(
    utilisateurId: string,
    limite?: number,
    statut?: StatutNotification
  ): Observable<Notification[]> {
    let notifications = this.notificationsSubject.value
      .filter(n => n.destinataireId === utilisateurId);

    if (statut) {
      notifications = notifications.filter(n => n.statut === statut);
    }

    if (limite) {
      notifications = notifications.slice(0, limite);
    }

    return of(notifications);
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  obtenirNombreNonLues(utilisateurId: string): Observable<number> {
    const count = this.notificationsSubject.value
      .filter(n => n.destinataireId === utilisateurId && n.statut === 'non_lue')
      .length;
    return of(count);
  }

  /**
   * Notifications pour nouvelles commandes
   */
  notifierNouvelleCommande(commandeId: string, numeroCommande: string): void {
    this.creerNotification(
      'Nouvelle commande',
      `Une nouvelle commande ${numeroCommande} a été créée`,
      'nouvelle_commande',
      'admin',
      'haute',
      { commandeId, numeroCommande }
    ).subscribe();
  }

  /**
   * Notifications pour commandes assignées
   */
  notifierCommandeAssignee(commandeId: string, numeroCommande: string, livreurId: string): void {
    this.creerNotification(
      'Commande assignée',
      `La commande ${numeroCommande} vous a été assignée`,
      'commande_assignee',
      livreurId,
      'haute',
      { commandeId, numeroCommande }
    ).subscribe();
  }

  /**
   * Notifications pour changements de statut
   */
  notifierChangementStatut(commandeId: string, numeroCommande: string, nouveauStatut: string, clientId: string): void {
    const messages: { [key: string]: string } = {
      'confirmee': 'Votre commande a été confirmée',
      'en_preparation': 'Votre commande est en préparation',
      'prete': 'Votre commande est prête pour la livraison',
      'en_cours': 'Votre commande est en cours de livraison',
      'livree': 'Votre commande a été livrée avec succès',
      'annulee': 'Votre commande a été annulée'
    };

    const message = messages[nouveauStatut] || `Statut de votre commande: ${nouveauStatut}`;

    this.creerNotification(
      'Mise à jour de commande',
      `${message} (${numeroCommande})`,
      'statut_commande',
      clientId,
      nouveauStatut === 'livree' ? 'haute' : 'normale',
      { commandeId, numeroCommande, statut: nouveauStatut }
    ).subscribe();
  }

  /**
   * Notification de livraison proche
   */
  notifierLivraisonProche(commandeId: string, numeroCommande: string, clientId: string, tempsEstime: number): void {
    this.creerNotification(
      'Livraison proche',
      `Votre livreur arrive dans environ ${tempsEstime} minutes`,
      'livraison_proche',
      clientId,
      'critique',
      { commandeId, numeroCommande, tempsEstime }
    ).subscribe();
  }

  private mettreAJourCompteur(): void {
    const count = this.notificationsSubject.value
      .filter(n => n.statut === 'non_lue')
      .length;
    this.compteurNonLues.next(count);
  }

  private genererNotificationsDemo(): void {
    const notifications: Notification[] = [
      {
        id: this.genererUUID(),
        titre: 'Nouvelle commande urgente',
        message: 'Une nouvelle commande urgente CMD-789456 nécessite votre attention',
        type: 'nouvelle_commande',
        destinataireId: 'admin',
        statut: 'non_lue',
        dateCreation: new Date(),
        priorite: 'critique'
      },
      {
        id: this.genererUUID(),
        titre: 'Commande livrée',
        message: 'Votre commande CMD-123456 a été livrée avec succès',
        type: 'livraison_terminee',
        destinataireId: 'client-1',
        statut: 'non_lue',
        dateCreation: new Date(Date.now() - 5 * 60 * 1000),
        priorite: 'normale'
      },
      {
        id: this.genererUUID(),
        titre: 'Livraison assignée',
        message: 'Une nouvelle livraison CMD-654321 vous a été assignée',
        type: 'commande_assignee',
        destinataireId: 'livreur-1',
        statut: 'lue',
        dateCreation: new Date(Date.now() - 15 * 60 * 1000),
        dateLecture: new Date(Date.now() - 10 * 60 * 1000),
        priorite: 'haute'
      },
      {
        id: this.genererUUID(),
        titre: 'Promotion spéciale',
        message: 'Profitez de -20% sur votre prochaine livraison',
        type: 'promotion',
        destinataireId: 'client-2',
        statut: 'non_lue',
        dateCreation: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priorite: 'basse'
      }
    ];

    this.notificationsSubject.next(notifications);
    this.mettreAJourCompteur();
  }

  private genererUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}