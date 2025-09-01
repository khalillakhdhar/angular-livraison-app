import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte()) {
    return true;
  }

  router.navigate(['/auth/connexion']);
  return false;
};

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte() && authService.aLeRole('admin')) {
    return true;
  }

  if (authService.estConnecte()) {
    // Rediriger vers le tableau de bord approprié selon le rôle
    const utilisateur = authService.obtenirUtilisateurActuel();
    if (utilisateur?.role === 'livreur') {
      router.navigate(['/livreur/dashboard']);
    } else if (utilisateur?.role === 'client') {
      router.navigate(['/client/suivi']);
    }
  } else {
    router.navigate(['/auth/connexion']);
  }

  return false;
};

export const livreurGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte() && authService.aLeRole('livreur')) {
    return true;
  }

  if (authService.estConnecte()) {
    // Rediriger vers le tableau de bord approprié selon le rôle
    const utilisateur = authService.obtenirUtilisateurActuel();
    if (utilisateur?.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (utilisateur?.role === 'client') {
      router.navigate(['/client/suivi']);
    }
  } else {
    router.navigate(['/auth/connexion']);
  }

  return false;
};

export const clientGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte() && authService.aLeRole('client')) {
    return true;
  }

  if (authService.estConnecte()) {
    // Rediriger vers le tableau de bord approprié selon le rôle
    const utilisateur = authService.obtenirUtilisateurActuel();
    if (utilisateur?.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (utilisateur?.role === 'livreur') {
      router.navigate(['/livreur/dashboard']);
    }
  } else {
    router.navigate(['/auth/connexion']);
  }

  return false;
};

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estConnecte()) {
    return true;
  }

  // Rediriger vers le tableau de bord approprié selon le rôle
  const utilisateur = authService.obtenirUtilisateurActuel();
  if (utilisateur?.role === 'admin') {
    router.navigate(['/admin/dashboard']);
  } else if (utilisateur?.role === 'livreur') {
    router.navigate(['/livreur/dashboard']);
  } else if (utilisateur?.role === 'client') {
    router.navigate(['/client/suivi']);
  }

  return false;
};