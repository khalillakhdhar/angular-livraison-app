import { Routes } from '@angular/router';
import { guestGuard, adminGuard, livreurGuard, clientGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Route par défaut - redirection vers auth
  {
    path: '',
    redirectTo: '/auth/connexion',
    pathMatch: 'full'
  },

  // Routes d'authentification (accessibles seulement si non connecté)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Routes Admin (accessibles seulement aux admins)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Routes Livreur (accessibles seulement aux livreurs)
  {
    path: 'livreur',
    canActivate: [livreurGuard],
    loadChildren: () => import('./features/livreur/livreur.routes').then(m => m.livreurRoutes)
  },

  // Routes Client (accessibles seulement aux clients)
  {
    path: 'client',
    canActivate: [clientGuard],
    loadChildren: () => import('./features/client/client.routes').then(m => m.clientRoutes)
  },

  // Route wildcard pour les 404
  {
    path: '**',
    redirectTo: '/auth/connexion'
  }
];