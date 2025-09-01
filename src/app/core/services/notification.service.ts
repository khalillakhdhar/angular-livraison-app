import { Injectable } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: ToastNotification[] = [];
  private notificationCounter = 0;

  constructor() {}

  // Afficher un message de succès
  showSuccess(message: string, duration: number = 4000): void {
    this.show('success', message, duration);
  }

  // Afficher un message d'erreur
  showError(message: string, duration: number = 6000): void {
    this.show('error', message, duration);
  }

  // Afficher un message d'avertissement
  showWarning(message: string, duration: number = 5000): void {
    this.show('warning', message, duration);
  }

  // Afficher un message d'information
  showInfo(message: string, duration: number = 4000): void {
    this.show('info', message, duration);
  }

  // Méthode principale pour afficher une notification
  private show(type: NotificationType, message: string, duration: number): void {
    const notification: ToastNotification = {
      id: `toast-${++this.notificationCounter}`,
      type,
      message,
      duration
    };

    // Créer l'élément DOM pour le toast
    this.createToastElement(notification);

    // Auto-suppression après la durée spécifiée
    setTimeout(() => {
      this.remove(notification.id);
    }, duration);
  }

  // Créer l'élément DOM du toast
  private createToastElement(notification: ToastNotification): void {
    const toast = document.createElement('div');
    toast.id = notification.id;
    toast.className = `toast ${notification.type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span>${notification.message}</span>
        <button onclick="document.getElementById('${notification.id}').remove()" 
                style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">
          ×
        </button>
      </div>
    `;

    // Ajouter au DOM
    document.body.appendChild(toast);

    // Positionner les toasts empilés
    this.updateToastPositions();
  }

  // Supprimer un toast
  private remove(id: string): void {
    const toast = document.getElementById(id);
    if (toast) {
      toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => {
        toast.remove();
        this.updateToastPositions();
      }, 300);
    }
  }

  // Mettre à jour les positions des toasts empilés
  private updateToastPositions(): void {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach((toast, index) => {
      (toast as HTMLElement).style.top = `${20 + (index * 80)}px`;
    });
  }

  // Supprimer tous les toasts
  clearAll(): void {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => toast.remove());
  }
}

// Style CSS pour l'animation de sortie (à ajouter dynamiquement)
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);