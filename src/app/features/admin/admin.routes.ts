import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'commandes',
        loadComponent: () => import('./commandes.component').then(m => m.AdminCommandesComponent)
      },
      {
        path: 'livreurs',
        loadComponent: () => import('./livreurs.component').then(m => m.AdminLivreursComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics.component').then(m => m.AdminAnalyticsComponent)
      }
    ]
  }
];