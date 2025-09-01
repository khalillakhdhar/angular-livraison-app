import { Routes } from '@angular/router';
import { LivreurLayoutComponent } from '../../layouts/livreur-layout.component';

export const livreurRoutes: Routes = [
  {
    path: '',
    component: LivreurLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard.component').then(m => m.LivreurDashboardComponent)
      },
      {
        path: 'livraisons',
        loadComponent: () => import('./livraisons.component').then(m => m.LivreurLivraisonsComponent)
      },
      {
        path: 'carte',
        loadComponent: () => import('./carte.component').then(m => m.LivreurCarteComponent)
      },
      {
        path: 'profil',
        loadComponent: () => import('./profil.component').then(m => m.LivreurProfilComponent)
      }
    ]
  }
];