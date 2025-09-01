# Angular Livraison App

Application de livraison Angular futuriste avec interface admin et livreur - 100% responsive et design moderne

## 🚀 Fonctionnalités

### Administration
- **Gestion des utilisateurs** : CRUD complet avec recherche, filtres par rôle, activation/désactivation
- **Gestion des commandes** : Filtres avancés, workflow de statuts, assignation en masse
- **Gestion des livreurs** : Suivi des performances, zones préférées, statuts en temps réel
- **Gestion des sorties** : Créer des tournées multi-livraisons avec optimisation de routes
- **Tableau de bord** : Statistiques en temps réel et actions rapides

### 📋 Formulaires avec Sélecteurs Géographiques

#### Formulaire Utilisateur
- **Champs** : Email, prénom, nom, rôle (admin|livreur|client), téléphone, gouvernorat, ville, statut actif
- **Sélecteurs dépendants** : Gouvernorat → Ville automatique
- **Validations** : Requis sur email, prénom, nom, rôle avec validation d'email
- **Actions** : Enregistrer, Annuler avec feedback visuel

#### Formulaire Commande
- **Type de livraison** : Pickup, Livraison, Retour
- **Adresses multiples** : Pickup et Livraison avec sélecteurs Gouvernorat → Ville
- **Assignment** : Client (requis), Livreur (optionnel)
- **Détails** : Prix (≥0), Notes optionnelles
- **États** : Nouvelle, Assignée, En cours, Livrée, etc.

#### Formulaire Sortie (Tournée)
- **Planification** : Date, Livreur assigné
- **Zone géographique** : Gouvernorat, Ville de départ, Villes desservies (multi-select)
- **Commandes** : Sélection multiple des commandes disponibles par zone
- **Statut** : Planifiée, En route, Terminée, Annulée
- **Integration** : Mise à jour automatique des commandes assignées

### 🔄 Persistance Hors-ligne
- **Firestore offline** : `enableMultiTabIndexedDbPersistence` avec fallback
- **Synchronisation** : Données disponibles hors-ligne, resynchronisation automatique
- **Navigation** : Continuité d'utilisation même sans connexion

### Fonctionnalités Techniques
- **Authentification** : Firebase Auth (Email/Password + Google)
- **Base de données** : Firestore avec règles de sécurité
- **Localisation** : Données complètes des 24 gouvernorats tunisiens
- **Design** : Glass morphism avec thème futuriste et néons
- **Responsive** : Mobile-first design avec Angular Material

## 🛠️ Technologies

- **Angular 17+** avec composants standalone
- **Firebase** (Auth, Firestore, Storage)
- **Angular Material** pour l'interface utilisateur
- **TypeScript** avec mode strict
- **RxJS** pour la programmation réactive
- **SCSS** pour les styles avancés

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Angular CLI (`npm install -g @angular/cli`)
- Compte Firebase

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/khalillakhdhar/angular-livraison-app.git
cd angular-livraison-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## ⚙️ Configuration Firebase

### 1. Configuration de l'environnement
Les fichiers d'environnement sont déjà configurés avec les clés Firebase fournies :

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyA711jTxygDNfbUOBBclSnDukkKWA22oRA",
    authDomain: "livraison-97b8b.firebaseapp.com",
    projectId: "livraison-97b8b",
    storageBucket: "livraison-97b8b.firebasestorage.app",
    messagingSenderId: "535657116969",
    appId: "1:535657116969:web:de3524e26a40f00268f338",
    measurementId: "G-NGQ9YDJ5TS"
  }
};
```

### 2. Déploiement des règles Firestore

Les règles de sécurité Firestore sont définies dans `firebase/firestore.rules`. Pour les déployer :

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser le projet (si pas déjà fait)
firebase init firestore

# Déployer les règles
firebase deploy --only firestore:rules
```

### 3. Règles de sécurité

Les règles implémentées permettent :

- **Administrateurs** : Accès complet à toutes les collections
- **Livreurs** : 
  - Lecture des commandes qui leur sont assignées
  - Mise à jour du statut des livraisons
  - Lecture des sorties assignées
- **Clients** : 
  - Création et gestion de leurs propres commandes
  - Lecture de leur profil utilisateur

### 4. Configuration de l'authentification Firebase

Dans la console Firebase :
1. Aller dans **Authentication > Sign-in method**
2. Activer **Email/Password**
3. Activer **Google** et configurer le consentement OAuth

## 🗂️ Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Services Angular (Auth, User, Order, etc.)
│   │   └── guards/          # Guards d'authentification
│   ├── features/
│   │   ├── auth/            # Composants d'authentification
│   │   └── admin/           # Interface d'administration
│   │       ├── layout/      # Layout principal admin
│   │       ├── dashboard/   # Tableau de bord
│   │       ├── utilisateurs/# Gestion des utilisateurs
│   │       ├── commandes/   # Gestion des commandes
│   │       ├── livreurs/    # Gestion des livreurs
│   │       └── sorties/     # Gestion des sorties
│   └── shared/              # Composants partagés
├── assets/
│   └── tn-locations.json   # Données géographiques tunisiennes
└── environments/           # Configuration d'environnement
```

## 👥 Modèles de données

### Utilisateur
```typescript
interface Utilisateur {
  uid: string;
  email: string;
  role: 'admin' | 'livreur' | 'client';
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  gouvernorat: string;
  photoURL?: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Commande
```typescript
interface Commande {
  id: string;
  numero: string;
  typeLivraison: 'pickup' | 'livraison' | 'retour';
  pickupAdresse: Adresse;
  livraisonAdresse: Adresse;
  etatLivraison: 'nouvelle' | 'assignée' | 'en_cours' | 'livrée' | 'échouée';
  prix: number;
  livreurId?: string;
  clientId: string;
  sortieId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sortie (Tournée multi-livraisons)
```typescript
interface Sortie {
  id: string;
  numero: string;
  date: Date;
  livreurId: string;
  gouvernorat: string;
  villeDepart: string;
  villesDesservies: string[];
  commandeIds: string[];
  statut: 'planifiée' | 'en_route' | 'terminée' | 'annulée';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌍 Données géographiques

L'application inclut les données complètes des 24 gouvernorats tunisiens avec leurs principales villes dans `src/assets/tn-locations.json`.

## 🔐 Sécurité

- **Authentification** : Firebase Auth avec validation côté client et serveur
- **Autorisation** : Règles Firestore basées sur les rôles
- **Validation** : Validation des formulaires avec Angular Reactive Forms
- **Guards** : Protection des routes selon les rôles utilisateur

## 🚀 Déploiement

### Déploiement avec Firebase Hosting

```bash
# Build de production
ng build --configuration production

# Déploiement sur Firebase Hosting
firebase deploy --only hosting
```

### Variables d'environnement de production

Assurez-vous que `src/environments/environment.prod.ts` contient les bonnes configurations Firebase pour la production.

## 🧪 Tests

```bash
# Tests unitaires
ng test

# Tests end-to-end
ng e2e

# Linting
ng lint
```

## 📱 Responsive Design

L'application est optimisée pour :
- **Desktop** : Layout complet avec sidebar
- **Tablet** : Layout adaptatif avec navigation collapsible
- **Mobile** : Interface mobile-first avec navigation drawer

## 🎨 Design System

- **Glass morphism** : Effets de transparence et de flou
- **Gradients** : Dégradés colorés futuristes
- **Animations** : Transitions fluides avec Angular Animations
- **Material Design** : Composants Angular Material customisés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

Développé avec ❤️ pour la communauté tunisienne de livraison