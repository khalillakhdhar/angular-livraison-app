import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  {
    path: '',
    redirectTo: 'suivi',
    pathMatch: 'full'
  },
  {
    path: 'suivi',
    loadComponent: () => import('./suivi/client-suivi.component').then(m => m.ClientSuiviComponent)
  }
];