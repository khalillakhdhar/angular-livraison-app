import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Utilisateur } from '../interfaces/utilisateur';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.authStateSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const userData = await this.getUserData(user.uid);
        if (userData) {
          this.currentUserSubject.next(userData);
          this.authStateSubject.next(true);
          await this.updateLastConnection(user.uid);
        }
      } else {
        this.currentUserSubject.next(null);
        this.authStateSubject.next(false);
      }
    });
  }

  // Connexion avec email et mot de passe
  async signInWithEmail(email: string, password: string): Promise<boolean> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.getUserData(credential.user.uid);
      
      if (!userData) {
        await this.signOut();
        this.notificationService.showError('Profil utilisateur introuvable');
        return false;
      }

      if (!userData.actif) {
        await this.signOut();
        this.notificationService.showError('Compte désactivé');
        return false;
      }

      // Redirection selon le rôle
      await this.redirectByRole(userData.role);
      this.notificationService.showSuccess(`Bienvenue ${userData.prenom} !`);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  // Connexion avec Google
  async signInWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      let userData = await this.getUserData(credential.user.uid);
      
      // Si c'est un nouvel utilisateur Google, créer le profil
      if (!userData && credential.user.email) {
        const newUser: Utilisateur = {
          uid: credential.user.uid,
          email: credential.user.email,
          nom: credential.user.displayName?.split(' ').slice(-1)[0] || '',
          prenom: credential.user.displayName?.split(' ')[0] || '',
          role: 'client', // Par défaut
          photoURL: credential.user.photoURL || undefined,
          actif: true,
          dateCreation: Date.now(),
          derniereConnexion: Date.now()
        };
        
        await this.createUserProfile(newUser);
        userData = newUser;
      }

      if (!userData || !userData.actif) {
        await this.signOut();
        this.notificationService.showError('Impossible de créer ou accéder au profil');
        return false;
      }

      await this.redirectByRole(userData.role);
      this.notificationService.showSuccess(`Bienvenue ${userData.prenom} !`);
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  // Inscription
  async register(userData: Partial<Utilisateur>, password: string): Promise<boolean> {
    try {
      if (!userData.email) {
        this.notificationService.showError('Email requis');
        return false;
      }

      const credential = await createUserWithEmailAndPassword(this.auth, userData.email, password);
      
      const newUser: Utilisateur = {
        uid: credential.user.uid,
        email: userData.email,
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        telephone: userData.telephone,
        role: userData.role || 'client',
        adresse: userData.adresse,
        actif: true,
        dateCreation: Date.now(),
        derniereConnexion: Date.now()
      };

      await this.createUserProfile(newUser);
      await this.redirectByRole(newUser.role);
      this.notificationService.showSuccess('Compte créé avec succès !');
      return true;
    } catch (error: any) {
      this.handleAuthError(error);
      return false;
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/connexion']);
      this.notificationService.showInfo('Déconnexion réussie');
    } catch (error: any) {
      this.notificationService.showError('Erreur lors de la déconnexion');
    }
  }

  // Créer le profil utilisateur dans Firestore
  private async createUserProfile(userData: Utilisateur): Promise<void> {
    const userRef = doc(this.firestore, 'users', userData.uid);
    await setDoc(userRef, userData);
  }

  // Récupérer les données utilisateur
  private async getUserData(uid: string): Promise<Utilisateur | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as Utilisateur;
      }
      return null;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      return null;
    }
  }

  // Mettre à jour la dernière connexion
  private async updateLastConnection(uid: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, {
        derniereConnexion: Date.now()
      });
    } catch (error) {
      console.error('Erreur mise à jour connexion:', error);
    }
  }

  // Redirection selon le rôle
  private async redirectByRole(role: string): Promise<void> {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'livreur':
        this.router.navigate(['/livreur/dashboard']);
        break;
      case 'client':
        this.router.navigate(['/client/suivi']);
        break;
      default:
        this.router.navigate(['/auth/connexion']);
    }
  }

  // Gestion des erreurs d'authentification
  private handleAuthError(error: any): void {
    let message = 'Erreur d\'authentification';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Utilisateur introuvable';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/email-already-in-use':
        message = 'Cette adresse email est déjà utilisée';
        break;
      case 'auth/weak-password':
        message = 'Le mot de passe doit contenir au moins 6 caractères';
        break;
      case 'auth/invalid-email':
        message = 'Adresse email invalide';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Connexion Google annulée';
        break;
      case 'auth/network-request-failed':
        message = 'Erreur de connexion réseau';
        break;
    }
    
    this.notificationService.showError(message);
  }

  // Getters pour l'état actuel
  get currentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.authStateSubject.value;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }
}