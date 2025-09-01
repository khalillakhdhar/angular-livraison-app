import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Commande, StatutCommande, FiltresCommande } from '../interfaces/commande.interface';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandesSubject = new BehaviorSubject<Commande[]>(this.genererCommandesDemo());
  public commandes$ = this.commandesSubject.asObservable();

  constructor() {}

  /**
   * Obtenir toutes les commandes
   */
  obtenirCommandes(): Observable<Commande[]> {
    return this.commandes$;
  }

  /**
   * Obtenir commandes avec filtres
   */
  obtenirCommandesAvecFiltres(filtres: FiltresCommande): Observable<Commande[]> {
    const commandes = this.commandesSubject.value;
    let commandesFiltrees = [...commandes];

    if (filtres.statuts && filtres.statuts.length > 0) {
      commandesFiltrees = commandesFiltrees.filter(c => filtres.statuts!.includes(c.statut));
    }

    if (filtres.dateDebut) {
      commandesFiltrees = commandesFiltrees.filter(c => c.dateCreation >= filtres.dateDebut!);
    }

    if (filtres.dateFin) {
      commandesFiltrees = commandesFiltrees.filter(c => c.dateCreation <= filtres.dateFin!);
    }

    if (filtres.clientId) {
      commandesFiltrees = commandesFiltrees.filter(c => c.clientId === filtres.clientId);
    }

    if (filtres.livreurId) {
      commandesFiltrees = commandesFiltrees.filter(c => c.livreurId === filtres.livreurId);
    }

    if (filtres.urgent !== undefined) {
      commandesFiltrees = commandesFiltrees.filter(c => c.urgent === filtres.urgent);
    }

    if (filtres.recherche) {
      const terme = filtres.recherche.toLowerCase();
      commandesFiltrees = commandesFiltrees.filter(c => 
        c.numeroCommande.toLowerCase().includes(terme) ||
        c.adresseLivraison.adresse.toLowerCase().includes(terme) ||
        c.adresseLivraison.ville.toLowerCase().includes(terme)
      );
    }

    return of(commandesFiltrees);
  }

  /**
   * Créer une nouvelle commande
   */
  creerCommande(commande: Partial<Commande>): Observable<Commande> {
    const nouvelleCommande: Commande = {
      id: this.genererUUID(),
      numeroCommande: this.genererNumeroCommande(),
      statut: 'nouvelle',
      dateCreation: new Date(),
      dateModification: new Date(),
      statutPaiement: 'en_attente',
      historiqueStatuts: [{
        statut: 'nouvelle',
        timestamp: new Date(),
        utilisateurId: 'system'
      }],
      ...commande
    } as Commande;

    const commandes = this.commandesSubject.value;
    commandes.unshift(nouvelleCommande);
    this.commandesSubject.next(commandes);

    return of(nouvelleCommande);
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  mettreAJourStatut(commandeId: string, nouveauStatut: StatutCommande, utilisateurId: string, commentaire?: string): Observable<boolean> {
    const commandes = this.commandesSubject.value;
    const index = commandes.findIndex(c => c.id === commandeId);

    if (index !== -1) {
      commandes[index].statut = nouveauStatut;
      commandes[index].dateModification = new Date();
      
      if (nouveauStatut === 'livree') {
        commandes[index].dateLivraisonReelle = new Date();
      }

      commandes[index].historiqueStatuts.push({
        statut: nouveauStatut,
        timestamp: new Date(),
        utilisateurId,
        commentaire
      });

      this.commandesSubject.next(commandes);
      return of(true);
    }

    return of(false);
  }

  /**
   * Assigner un livreur à une commande
   */
  assignerLivreur(commandeId: string, livreurId: string): Observable<boolean> {
    const commandes = this.commandesSubject.value;
    const index = commandes.findIndex(c => c.id === commandeId);

    if (index !== -1) {
      commandes[index].livreurId = livreurId;
      commandes[index].statut = 'assignee';
      commandes[index].dateModification = new Date();
      
      commandes[index].historiqueStatuts.push({
        statut: 'assignee',
        timestamp: new Date(),
        utilisateurId: 'admin',
        commentaire: `Assignée au livreur ${livreurId}`
      });

      this.commandesSubject.next(commandes);
      return of(true);
    }

    return of(false);
  }

  /**
   * Obtenir statistiques des commandes
   */
  obtenirStatistiques(): Observable<any> {
    const commandes = this.commandesSubject.value;
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);

    const stats = {
      total: commandes.length,
      nouvelles: commandes.filter(c => c.statut === 'nouvelle').length,
      enCours: commandes.filter(c => ['assignee', 'en_preparation', 'prete', 'en_cours'].includes(c.statut)).length,
      livrees: commandes.filter(c => c.statut === 'livree').length,
      annulees: commandes.filter(c => c.statut === 'annulee').length,
      urgentes: commandes.filter(c => c.urgent).length,
      chiffreAffairesMois: commandes
        .filter(c => c.dateCreation >= debutMois && c.statut === 'livree')
        .reduce((total, c) => total + c.total, 0),
      tauxReussite: commandes.length > 0 
        ? Math.round((commandes.filter(c => c.statut === 'livree').length / commandes.length) * 100)
        : 0
    };

    return of(stats);
  }

  /**
   * Générer des commandes de démonstration
   */
  private genererCommandesDemo(): Commande[] {
    const commandes: Commande[] = [];
    const statuts: StatutCommande[] = ['nouvelle', 'assignee', 'en_cours', 'livree', 'annulee'];
    const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'];

    for (let i = 1; i <= 50; i++) {
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      const ville = villes[Math.floor(Math.random() * villes.length)];
      const urgent = Math.random() < 0.2; // 20% de commandes urgentes
      const dateCreation = new Date();
      dateCreation.setDate(dateCreation.getDate() - Math.floor(Math.random() * 30));

      commandes.push({
        id: this.genererUUID(),
        numeroCommande: `CMD-${String(i).padStart(6, '0')}`,
        clientId: `client-${Math.floor(Math.random() * 10) + 1}`,
        livreurId: statut !== 'nouvelle' ? `livreur-${Math.floor(Math.random() * 5) + 1}` : undefined,
        statut,
        dateCreation,
        dateModification: dateCreation,
        dateLivraisonPrevue: new Date(dateCreation.getTime() + (24 * 60 * 60 * 1000)),
        dateLivraisonReelle: statut === 'livree' ? new Date(dateCreation.getTime() + (20 * 60 * 60 * 1000)) : undefined,
        adresseEnlevement: {
          id: 'depot-1',
          nom: 'Dépôt Central',
          telephone: '+33123456789',
          adresse: '123 Rue du Commerce',
          ville: ville,
          codePostal: '75001',
          pays: 'France',
          position: { latitude: 48.8566, longitude: 2.3522 }
        },
        adresseLivraison: {
          id: `addr-${i}`,
          nom: `Client ${i}`,
          telephone: `+3312345${String(i).padStart(4, '0')}`,
          adresse: `${i} Rue de la Livraison`,
          ville: ville,
          codePostal: `${75000 + Math.floor(Math.random() * 20)}`,
          pays: 'France',
          position: { 
            latitude: 48.8566 + (Math.random() - 0.5) * 0.1, 
            longitude: 2.3522 + (Math.random() - 0.5) * 0.1 
          }
        },
        articles: [
          {
            id: `article-${i}`,
            nom: `Produit ${i}`,
            description: `Description du produit ${i}`,
            quantite: Math.floor(Math.random() * 3) + 1,
            prix: Math.floor(Math.random() * 100) + 10,
            categories: ['electronique']
          }
        ],
        poids: Math.floor(Math.random() * 5) + 0.5,
        valeur: Math.floor(Math.random() * 200) + 20,
        fragile: Math.random() < 0.3,
        urgent,
        coutLivraison: urgent ? 15 : 8,
        total: Math.floor(Math.random() * 150) + 25,
        methodePaiement: ['carte', 'especes', 'virement'][Math.floor(Math.random() * 3)],
        statutPaiement: statut === 'livree' ? 'paye' : 'en_attente',
        historiqueStatuts: [
          {
            statut: 'nouvelle',
            timestamp: dateCreation,
            utilisateurId: 'system'
          }
        ]
      });
    }

    return commandes.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
  }

  private genererUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private genererNumeroCommande(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMD-${timestamp}${random}`;
  }
}