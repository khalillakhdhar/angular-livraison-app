import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full'
  },
  {
    path: 'connexion',
    loadComponent: () => import('./connexion.component').then(m => m.ConnexionComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'mot-de-passe',
    loadComponent: () => import('./mot-de-passe.component').then(m => m.MotDePasseComponent)
  }
];