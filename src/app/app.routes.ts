import { Routes } from '@angular/router';
import { authGuard, adminGuard, livreurGuard, clientGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/connexion',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'livreur',
    canActivate: [livreurGuard],
    loadChildren: () => import('./features/livreur/livreur.routes').then(m => m.livreurRoutes)
  },
  {
    path: 'client',
    canActivate: [clientGuard],
    loadChildren: () => import('./features/client/client.routes').then(m => m.clientRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/connexion'
  }
];
