import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, 
         getDocs, getDoc, query, where, orderBy, limit, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilisateur, CreateUtilisateurRequest, UpdateUtilisateurRequest } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: any;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async createUser(userData: CreateUtilisateurRequest): Promise<Utilisateur> {
    // Create Firebase Auth user
    const credential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
    
    const newUser: Utilisateur = {
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

    // Save user profile to Firestore
    const userDoc = doc(this.firestore, 'users', credential.user.uid);
    await setDoc(userDoc, newUser);
    
    return newUser;
  }

  async getAllUsers(): Promise<Utilisateur[]> {
    const q = query(this.usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    });
  }

  async getUserById(uid: string): Promise<Utilisateur | null> {
    const userDoc = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      return {
        ...data,
        uid: docSnap.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    }
    
    return null;
  }

  async getUsersByRole(role: 'admin' | 'livreur' | 'client'): Promise<Utilisateur[]> {
    const q = query(
      this.usersCollection, 
      where('role', '==', role),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    });
  }

  async searchUsers(searchTerm: string, role?: 'admin' | 'livreur' | 'client'): Promise<Utilisateur[]> {
    let q = query(this.usersCollection, orderBy('createdAt', 'desc'));
    
    if (role) {
      q = query(this.usersCollection, where('role', '==', role), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const users = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    });

    // Filter locally by search term
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nom.toLowerCase().includes(term) ||
      user.prenom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.telephone.includes(term)
    );
  }

  async updateUser(uid: string, updates: UpdateUtilisateurRequest): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, {
      ...updates,
      updatedAt: new Date()
    } as any);
  }

  async deleteUser(uid: string): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await deleteDoc(userDoc);
    // Note: You may also want to delete the Firebase Auth user
    // This requires admin SDK or a cloud function
  }

  async activateUser(uid: string): Promise<void> {
    await this.updateUser(uid, { actif: true });
  }

  async deactivateUser(uid: string): Promise<void> {
    await this.updateUser(uid, { actif: false });
  }

  async promoteUser(uid: string, newRole: 'admin' | 'livreur' | 'client'): Promise<void> {
    await this.updateUser(uid, { role: newRole });
  }

  async resetUserPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async getUsersByGovernorate(gouvernorat: string): Promise<Utilisateur[]> {
    const q = query(
      this.usersCollection, 
      where('gouvernorat', '==', gouvernorat),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        uid: doc.id,
        createdAt: data['createdAt']?.toDate() || new Date(),
        updatedAt: data['updatedAt']?.toDate() || new Date()
      } as Utilisateur;
    });
  }

  async getUsersCount(): Promise<{ total: number; admin: number; livreur: number; client: number; actifs: number }> {
    const querySnapshot = await getDocs(this.usersCollection);
    const users = querySnapshot.docs.map(doc => doc.data() as Utilisateur);
    
    return {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      livreur: users.filter(u => u.role === 'livreur').length,
      client: users.filter(u => u.role === 'client').length,
      actifs: users.filter(u => u.actif).length
    };
  }
}