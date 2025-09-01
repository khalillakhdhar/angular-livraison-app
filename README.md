# 🚀 Angular Livraison App - Application de Livraison Futuriste

Une application Angular 17+ complète de gestion de livraisons avec une interface utilisateur futuriste et des fonctionnalités avancées.

![Login](https://github.com/user-attachments/assets/1f2fcd48-f3b8-41df-bf1d-edb81261ccf6)
![Admin Dashboard](https://github.com/user-attachments/assets/ac70b4c9-6899-4ab7-a2aa-7ec328185a66)

## ✨ Fonctionnalités

### 🎨 Design Futuriste
- **Glass Morphism** avec effets de transparence et blur
- **Thème sombre** avec accents néon (#00ffff, #ff00ff, #00ff00)
- **Animations fluides** et transitions CSS
- **Design responsive** avec approche mobile-first
- **Typographie moderne** avec polices système optimisées

### 👥 Interfaces Utilisateur

#### 🛡️ Interface Admin
- **Tableau de bord** avec KPIs et métriques en temps réel
- **Gestion des commandes** (nouvelle, en cours, livrée, annulée)
- **Gestion des livreurs** avec statuts et performances
- **Analytics** et rapports détaillés
- **Système de notifications** avec badges
- **Actions rapides** pour navigation efficace

#### 🚛 Interface Livreur
- **Dashboard livreur** avec commandes assignées
- **Suivi des livraisons** en temps réel
- **Historique** et statistiques personnelles

#### 👤 Interface Client
- **Suivi de commande** en temps réel
- **Historique des commandes**
- **Profil utilisateur**

### 🔐 Système d'Authentification
- **Connexion email/mot de passe** (simulée pour démo)
- **Connexion Google** (interface prête)
- **Guards de navigation** par rôle (admin/livreur/client)
- **Redirection automatique** selon le rôle utilisateur

### 🏗️ Architecture Technique
- **Angular 17+** avec composants standalone
- **Structure modulaire** (core, shared, features, layouts)
- **Services dédiés** (authentication, commandes, notifications)
- **Interfaces TypeScript** complètes
- **Routing paresseux** (lazy loading)

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm
- Angular CLI 17+

### Installation
```bash
# Cloner le repository
git clone https://github.com/khalillakhdhar/angular-livraison-app.git
cd angular-livraison-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:4200`

### 👨‍💼 Comptes de Démo

#### Admin
- **Email**: admin@test.com
- **Mot de passe**: password123
- **Accès**: Tableau de bord administrateur complet

#### Livreur
- **Email**: livreur@test.com  
- **Mot de passe**: password123
- **Accès**: Interface livreur (en développement)

#### Client
- **Email**: client@test.com
- **Mot de passe**: password123  
- **Accès**: Interface client (en développement)

## 🎯 Fonctionnalités Implémentées

### ✅ Phase 1 - Base (Actuelle)
- [x] Application Angular 17+ avec composants standalone
- [x] Système d'authentification avec guards de navigation
- [x] Interface de connexion futuriste avec glass morphism
- [x] Tableau de bord admin avec KPIs et métriques
- [x] Services de gestion des commandes et notifications
- [x] Design responsive et thème futuriste
- [x] Structure de projet modulaire et évolutive
- [x] Navigation par rôles (admin/livreur/client)

### 🔄 Phase 2 - Fonctionnalités Avancées (En développement)
- [ ] Intégration Firebase complète (Auth, Firestore, Storage)
- [ ] Cartes interactives avec Leaflet et géolocalisation
- [ ] Système de notifications push en temps réel
- [ ] Analytics avec Chart.js et graphiques interactifs
- [ ] Gestion complète des commandes et livreurs
- [ ] Interface livreur avec suivi GPS
- [ ] Interface client avec suivi temps réel

## 🛠️ Technologies Utilisées

### Frontend
- **Angular 17+** avec architecture standalone
- **TypeScript** pour la sécurité des types
- **SCSS** pour les styles avancés
- **RxJS** pour la programmation réactive

### Dépendances Installées
- **@angular/fire** - Intégration Firebase (prêt pour utilisation)
- **@angular/material** - Composants Material Design
- **@angular/animations** - Animations avancées
- **chart.js & ng2-charts** - Graphiques et analytics
- **leaflet** - Cartes interactives (prêt pour implémentation)

## 📂 Structure du Projet

```
src/
├── app/
│   ├── core/                     # Services et utilitaires globaux
│   │   ├── services/             # Services (auth, commandes, notifications)
│   │   ├── guards/               # Guards de navigation par rôle
│   │   ├── interfaces/           # Models TypeScript
│   │   └── interceptors/         # Intercepteurs HTTP
│   ├── shared/                   # Composants partagés
│   │   ├── components/           # Composants réutilisables
│   │   ├── pipes/                # Pipes personnalisés
│   │   └── directives/           # Directives personnalisées
│   ├── features/                 # Fonctionnalités métier
│   │   ├── admin/                # Interface administrateur
│   │   │   ├── dashboard/        # ✅ Tableau de bord admin
│   │   │   ├── commandes/        # 🔄 Gestion des commandes
│   │   │   ├── livreurs/         # 🔄 Gestion des livreurs
│   │   │   └── analytics/        # 🔄 Analytics et rapports
│   │   ├── livreur/              # Interface livreur
│   │   │   ├── dashboard/        # 🔄 Tableau de bord livreur
│   │   │   ├── livraisons/       # 🔄 Gestion des livraisons
│   │   │   ├── carte/            # 🔄 Carte interactive
│   │   │   └── profil/           # 🔄 Profil livreur
│   │   ├── client/               # Interface client
│   │   │   ├── suivi/            # 🔄 Suivi de commande
│   │   │   ├── historique/       # 🔄 Historique
│   │   │   └── profil/           # 🔄 Profil client
│   │   └── auth/                 # Authentification
│   │       ├── connexion/        # ✅ Page de connexion
│   │       ├── inscription/      # 🔄 Page d'inscription
│   │       └── mot-de-passe/     # 🔄 Récupération mot de passe
│   └── layouts/                  # Layouts d'application
│       ├── admin-layout/         # 🔄 Layout admin
│       ├── livreur-layout/       # 🔄 Layout livreur
│       └── client-layout/        # 🔄 Layout client
├── assets/                       # Ressources statiques
├── environments/                 # Configuration environnements
└── styles.scss                   # Styles globaux futuristes
```

**Légende**: ✅ Implémenté | 🔄 En développement

## 🧪 Scripts Disponibles

```bash
# Développement
npm start                 # Serveur de développement
npm run build            # Build de production

# Tests (à implémenter)
npm test                 # Tests unitaires
npm run e2e              # Tests end-to-end
npm run lint             # Linting du code
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**🚀 Développé avec passion pour l'écosystème Angular et les technologies web modernes**

*Application en développement actif - Nouvelles fonctionnalités ajoutées régulièrement*
