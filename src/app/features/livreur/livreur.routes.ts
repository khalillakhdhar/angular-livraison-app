import { Routes } from '@angular/router';

export const livreurRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/livreur-dashboard.component').then(m => m.LivreurDashboardComponent)
  }
];