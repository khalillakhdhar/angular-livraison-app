import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut, onAuthStateChanged, User, GoogleAuthProvider, 
         signInWithPopup, sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Utilisateur, CreateUtilisateurRequest } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Monitor auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userDoc = await this.getUserProfile(user.uid);
        this.currentUserSubject.next(userDoc);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async loginWithEmail(email: string, password: string): Promise<Utilisateur> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const userProfile = await this.getUserProfile(credential.user.uid);
    if (!userProfile) {
      throw new Error('Profil utilisateur non trouvé');
    }
    return userProfile;
  }

  async loginWithGoogle(): Promise<Utilisateur> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    
    // Check if user profile exists
    let userProfile = await this.getUserProfile(credential.user.uid);
    
    if (!userProfile && credential.user.email) {
      // Create profile for new Google user
      userProfile = await this.createUserProfile({
        uid: credential.user.uid,
        email: credential.user.email,
        role: 'client',
        nom: credential.user.displayName?.split(' ')[1] || '',
        prenom: credential.user.displayName?.split(' ')[0] || '',
        telephone: '',
        ville: '',
        gouvernorat: '',
        photoURL: credential.user.photoURL || undefined,
        actif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    if (!userProfile) {
      throw new Error('Erreur lors de la création du profil utilisateur');
    }
    
    return userProfile;
  }

  async registerWithEmail(userData: CreateUtilisateurRequest): Promise<Utilisateur> {
    const credential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
    
    const userProfile: Utilisateur = {
      uid: credential.user.uid,
      email: userData.email,
      role: userData.role,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone,
      ville: userData.ville,
      gouvernorat: userData.gouvernorat,
      actif: userData.actif ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.createUserProfile(userProfile);
    return userProfile;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async getUserProfile(uid: string): Promise<Utilisateur | null> {
    const userDoc = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      return {
        ...data,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    }
    
    return null;
  }

  async createUserProfile(userData: Utilisateur): Promise<Utilisateur> {
    const userDoc = doc(this.firestore, 'users', userData.uid);
    await setDoc(userDoc, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return userData;
  }

  async updateUserProfile(uid: string, updates: Partial<Utilisateur>): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, {
      ...updates,
      updatedAt: new Date()
    });
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isLivreur(): boolean {
    return this.hasRole('livreur');
  }

  isClient(): boolean {
    return this.hasRole('client');
  }
}