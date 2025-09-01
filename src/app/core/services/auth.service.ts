import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, from, of, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Utilisateur, TypeRole } from '../interfaces/utilisateur.interface';

export interface DonneesConnexion {
  email: string;
  motDePasse: string;
}

export interface DonneesInscription extends DonneesConnexion {
  nom: string;
  prenom: string;
  telephone: string;
  role: TypeRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  private utilisateurActuelSubject = new BehaviorSubject<Utilisateur | null>(null);
  public utilisateurActuel$ = this.utilisateurActuelSubject.asObservable();

  private chargeInitiale = false;

  constructor() {
    // Pour le moment, nous simulons un utilisateur non connecté
    this.chargeInitiale = true;
  }

  /**
   * Connexion avec email et mot de passe (simulée)
   */
  async connecterAvecEmail(donnees: DonneesConnexion): Promise<Utilisateur> {
    try {
      // Simulation d'une connexion réussie
      const utilisateurSimule: Utilisateur = {
        id: '1',
        email: donnees.email,
        nom: 'Demo',
        prenom: 'User',
        telephone: '+33123456789',
        role: 'admin', // Par défaut pour la démo
        dateCreation: new Date(),
        dateModification: new Date(),
        actif: true
      };
      
      this.utilisateurActuelSubject.next(utilisateurSimule);
      return utilisateurSimule;
    } catch (error) {
      throw this.gererErreurAuth(error);
    }
  }

  /**
   * Connexion avec Google (simulée)
   */
  async connecterAvecGoogle(): Promise<Utilisateur> {
    try {
      const utilisateurSimule: Utilisateur = {
        id: '2',
        email: 'demo@google.com',
        nom: 'Google',
        prenom: 'User',
        telephone: '',
        role: 'client',
        dateCreation: new Date(),
        dateModification: new Date(),
        actif: true
      };
      
      this.utilisateurActuelSubject.next(utilisateurSimule);
      return utilisateurSimule;
    } catch (error) {
      throw this.gererErreurAuth(error);
    }
  }

  /**
   * Inscription avec email et mot de passe (simulée)
   */
  async inscrire(donnees: DonneesInscription): Promise<Utilisateur> {
    try {
      const nouvelUtilisateur: Utilisateur = {
        id: '3',
        email: donnees.email,
        nom: donnees.nom,
        prenom: donnees.prenom,
        telephone: donnees.telephone,
        role: donnees.role,
        dateCreation: new Date(),
        dateModification: new Date(),
        actif: true
      };
      
      this.utilisateurActuelSubject.next(nouvelUtilisateur);
      return nouvelUtilisateur;
    } catch (error) {
      throw this.gererErreurAuth(error);
    }
  }

  /**
   * Déconnexion
   */
  async deconnecter(): Promise<void> {
    try {
      this.utilisateurActuelSubject.next(null);
      this.router.navigate(['/auth/connexion']);
    } catch (error) {
      throw this.gererErreurAuth(error);
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  obtenirUtilisateurActuel(): Utilisateur | null {
    return this.utilisateurActuelSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  estConnecte(): boolean {
    return this.utilisateurActuelSubject.value !== null;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  aLeRole(role: TypeRole): boolean {
    const utilisateur = this.obtenirUtilisateurActuel();
    return utilisateur?.role === role;
  }

  /**
   * Gérer les erreurs d'authentification
   */
  private gererErreurAuth(error: any): Error {
    let message = 'Une erreur est survenue';
    
    if (error?.message) {
      message = error.message;
    }
    
    return new Error(message);
  }
}