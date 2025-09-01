import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['success-snackbar']
    });
  }

  error(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['error-snackbar']
    });
  }

  warning(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['info-snackbar']
    });
  }

  show(message: string, type: NotificationType = 'info', duration?: number) {
    switch (type) {
      case 'success':
        this.success(message, duration);
        break;
      case 'error':
        this.error(message, duration);
        break;
      case 'warning':
        this.warning(message, duration);
        break;
      default:
        this.info(message, duration);
        break;
    }
  }
}