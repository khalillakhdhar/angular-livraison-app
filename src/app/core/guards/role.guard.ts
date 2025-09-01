import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Fonction de garde pour protéger les routes par rôle
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    return authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          notificationService.showWarning('Vous devez vous connecter pour accéder à cette page');
          router.navigate(['/auth/connexion']);
          return false;
        }

        const currentUser = authService.currentUser;
        if (!currentUser) {
          notificationService.showError('Profil utilisateur introuvable');
          router.navigate(['/auth/connexion']);
          return false;
        }

        if (!allowedRoles.includes(currentUser.role)) {
          notificationService.showError('Accès non autorisé pour votre rôle');
          
          // Redirection vers la page appropriée selon le rôle
          switch (currentUser.role) {
            case 'admin':
              router.navigate(['/admin/dashboard']);
              break;
            case 'livreur':
              router.navigate(['/livreur/dashboard']);
              break;
            case 'client':
              router.navigate(['/client/suivi']);
              break;
            default:
              router.navigate(['/auth/connexion']);
          }
          return false;
        }

        return true;
      })
    );
  };
};

// Gardes spécialisées pour chaque rôle
export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const livreurGuard: CanActivateFn = roleGuard(['livreur']);
export const clientGuard: CanActivateFn = roleGuard(['client']);

// Garde pour les utilisateurs connectés (tous rôles)
export const authGuard: CanActivateFn = roleGuard(['admin', 'livreur', 'client']);

// Garde pour empêcher l'accès aux pages d'auth si déjà connecté
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        const currentUser = authService.currentUser;
        if (currentUser) {
          // Redirection vers la page appropriée selon le rôle
          switch (currentUser.role) {
            case 'admin':
              router.navigate(['/admin/dashboard']);
              break;
            case 'livreur':
              router.navigate(['/livreur/dashboard']);
              break;
            case 'client':
              router.navigate(['/client/suivi']);
              break;
            default:
              router.navigate(['/']);
          }
          return false;
        }
      }
      return true;
    })
  );
};