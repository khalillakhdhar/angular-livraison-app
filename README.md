# Application de Livraison Futuriste Angular

Une application web moderne de gestion de livraisons développée avec Angular 17+, featuring un design futuriste avec thème néon, des interfaces multi-rôles, et des intégrations Firebase, Leaflet et Chart.js.

![Angular](https://img.shields.io/badge/Angular-17+-red)
![Firebase](https://img.shields.io/badge/Firebase-10+-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![SCSS](https://img.shields.io/badge/SCSS-Futuristic-purple)

## 🚀 Fonctionnalités

### 🔐 Authentification Multi-Rôles
- Connexion par email/mot de passe
- Connexion Google OAuth
- Gestion des rôles : Admin, Livreur, Client
- Guards de protection des routes

### 👑 Interface Administrateur
- Dashboard avec KPIs et graphiques Chart.js en temps réel
- Gestion complète des commandes avec filtres avancés
- Vue d'ensemble des livreurs actifs
- Analytics et rapports de performance
- Interface responsive avec design glass morphism

### 🚚 Interface Livreur
- Dashboard personnel avec statistiques de livraisons
- Carte interactive Leaflet avec géolocalisation temps réel
- Suivi des commandes assignées
- Gestion du statut de disponibilité
- Profil et paramètres personnalisés

### 👤 Interface Client
- Suivi de commande en temps réel avec barre de progression
- Historique complet des commandes avec filtres
- Gestion des adresses de livraison multiples
- Profil utilisateur et préférences
- Notifications et paramètres personnalisés

### 🎨 Design Futuriste
- Thème sombre avec accents néon (cyan, magenta, vert)
- Animations et micro-interactions fluides
- Glass morphism et effets visuels avancés
- Typography Orbitron & Rajdhani
- Responsive design mobile-first

## 🛠️ Technologies Utilisées

- **Framework**: Angular 17+ (Standalone Components)
- **Backend**: Firebase (Auth + Firestore)
- **UI/UX**: SCSS custom, Angular Material (minimal)
- **Cartes**: Leaflet avec géolocalisation
- **Graphiques**: Chart.js pour analytics
- **TypeScript**: Configuration stricte
- **PWA**: Support service worker (optionnel)

## 📋 Prérequis

- Node.js 20+ 
- npm 10+
- Angular CLI 17+
- Compte Firebase

## 🚦 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/khalillakhdhar/angular-livraison-app.git
cd angular-livraison-app
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Firebase

1. Créer un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activer Authentication (Email/Password + Google)
3. Créer une base de données Firestore
4. Copier les clés de configuration

### 4. Configurer les variables d'environnement

Modifier `src/environments/environment.ts` et `src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: false, // true pour production
  firebase: {
    apiKey: "votre-api-key",
    authDomain: "votre-project-id.firebaseapp.com",
    projectId: "votre-project-id",
    storageBucket: "votre-project-id.appspot.com",
    messagingSenderId: "votre-sender-id",
    appId: "votre-app-id"
  }
};
```

### 5. Configurer les règles Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Règles pour les commandes
    match /commandes/{commandeId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## 🎯 Scripts NPM

```bash
# Démarrer le serveur de développement
npm start

# Builder l'application
npm run build

# Builder pour la production
npm run build -- --configuration production

# Lancer les tests
npm test

# Linter le code
npm run lint
```

## 🏗️ Structure du Projet

```
src/
├── app/
│   ├── core/                    # Services et utilitaires centraux
│   │   ├── services/           # Auth, Orders, Geolocation, Notifications
│   │   ├── interfaces/         # Types TypeScript
│   │   └── guards/            # Guards d'authentification
│   ├── layouts/               # Layouts pour chaque rôle
│   │   ├── admin-layout.component.ts
│   │   ├── livreur-layout.component.ts
│   │   └── client-layout.component.ts
│   ├── features/              # Modules fonctionnels
│   │   ├── auth/             # Authentification
│   │   ├── admin/            # Interface administrateur
│   │   ├── livreur/          # Interface livreur
│   │   └── client/           # Interface client
│   └── shared/               # Composants partagés
├── environments/             # Configuration par environnement
├── assets/                  # Ressources statiques
└── styles.scss             # Styles globaux futuristes
```

## 🚀 Déploiement

### Firebase Hosting

1. Installer Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Se connecter à Firebase :
```bash
firebase login
```

3. Initialiser le projet :
```bash
firebase init hosting
```

4. Builder et déployer :
```bash
npm run build
firebase deploy
```

### Variables d'environnement pour déploiement

Pour la production, assurez-vous de :
- Configurer les bonnes clés Firebase dans `environment.prod.ts`
- Activer HTTPS pour les domaines personnalisés
- Configurer les redirections et headers de sécurité

## 🔧 Configuration Avancée

### PWA (Progressive Web App)
```bash
ng add @angular/pwa
```

### Analytics Firebase
```bash
npm install @angular/fire
```

### Notifications Push
Configurer Firebase Cloud Messaging dans le service worker.

## 🎮 Utilisation

### Démarrage rapide

1. **Lancer l'application** : `npm start`
2. **Accéder à** : `http://localhost:4200`
3. **Route par défaut** : `/auth/connexion`

### Comptes de test

Pour tester l'application, créer des utilisateurs avec différents rôles dans Firebase Authentication, puis ajouter leur profil dans Firestore avec le champ `role` approprié.

### Navigation par rôle

- **Admin** : `/admin/dashboard` - Gestion complète
- **Livreur** : `/livreur/dashboard` - Interface livreur avec carte
- **Client** : `/client/suivi` - Suivi de commandes

## 🔒 Sécurité

- Authentication Firebase avec gestion des sessions
- Guards de protection des routes par rôle
- Validation côté client et règles Firestore
- Sanitisation des données utilisateur
- Headers de sécurité pour le déploiement

## 🌟 Fonctionnalités Avancées

### Géolocalisation
- Suivi temps réel de la position du livreur
- Calcul automatique des distances et ETAs
- Intégration avec les API de cartographie

### Notifications
- Système de toasts personnalisé
- Notifications de changement de statut
- Support des notifications push (à implémenter)

### Analytics
- Graphiques Chart.js interactifs
- Métriques de performance en temps réel
- Exports de données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Notes de Développement

### Composants Standalone
L'application utilise exclusivement des composants standalone Angular 17+ pour une architecture moderne et modulaire.

### État de Développement
- ✅ Architecture complète implémentée
- ✅ Authentification multi-rôles fonctionnelle
- ✅ Interfaces utilisateur complètes
- ✅ Intégration Firebase opérationnelle
- ✅ Géolocalisation et cartes Leaflet
- ✅ Design responsive futuriste
- ⏳ Fonctionnalités avancées à implémenter (notifications push, Cloud Functions)

### Performance
- Lazy loading des modules
- Tree shaking automatique
- Optimisation des bundles
- Service worker pour PWA

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Khalil Lakhdhar**
- GitHub: [@khalillakhdhar](https://github.com/khalillakhdhar)

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**
