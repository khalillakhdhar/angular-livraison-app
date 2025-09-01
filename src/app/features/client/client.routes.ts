import { Routes } from '@angular/router';
import { ClientLayoutComponent } from '../../layouts/client-layout.component';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'suivi',
        pathMatch: 'full'
      },
      {
        path: 'suivi',
        loadComponent: () => import('./suivi.component').then(m => m.ClientSuiviComponent)
      },
      {
        path: 'historique',
        loadComponent: () => import('./historique.component').then(m => m.ClientHistoriqueComponent)
      },
      {
        path: 'profil',
        loadComponent: () => import('./profil.component').then(m => m.ClientProfilComponent)
      }
    ]
  }
];