import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed?: number | null;
  heading?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private positionSubject = new BehaviorSubject<Position | null>(null);
  public position$ = this.positionSubject.asObservable();

  private watchId: number | null = null;
  private isWatching = false;

  constructor() {}

  // Obtenir la position actuelle une seule fois
  getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading
          };
          resolve(pos);
        },
        (error) => {
          reject(this.handleError(error));
        },
        options
      );
    });
  }

  // Commencer le suivi de position en temps réel
  startWatching(): Observable<Position> {
    if (this.isWatching) {
      return this.position$;
    }

    if (!navigator.geolocation) {
      throw new Error('La géolocalisation n\'est pas supportée par ce navigateur');
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000 // 30 secondes de cache maximum
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed,
          heading: position.coords.heading
        };
        
        this.positionSubject.next(pos);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', this.handleError(error));
        // Ne pas arrêter le suivi en cas d'erreur temporaire
      },
      options
    );

    this.isWatching = true;
    return this.position$;
  }

  // Arrêter le suivi de position
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  // Calculer la distance entre deux points (en kilomètres)
  calculateDistance(pos1: { latitude: number; longitude: number }, pos2: { latitude: number; longitude: number }): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(pos2.latitude - pos1.latitude);
    const dLon = this.toRad(pos2.longitude - pos1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(pos1.latitude)) * Math.cos(this.toRad(pos2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculer le cap/direction entre deux points (en degrés)
  calculateBearing(pos1: { latitude: number; longitude: number }, pos2: { latitude: number; longitude: number }): number {
    const dLon = this.toRad(pos2.longitude - pos1.longitude);
    const lat1 = this.toRad(pos1.latitude);
    const lat2 = this.toRad(pos2.latitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = Math.atan2(y, x);
    return (this.toDeg(bearing) + 360) % 360;
  }

  // Estimer le temps de trajet (très basique, en minutes)
  estimateTravelTime(distance: number, avgSpeed: number = 30): number {
    // distance en km, avgSpeed en km/h
    return Math.round((distance / avgSpeed) * 60); // en minutes
  }

  // Vérifier si la géolocalisation est disponible
  isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
  }

  // Vérifier les permissions de géolocalisation
  async checkPermissions(): Promise<PermissionState> {
    if (!navigator.permissions) {
      return 'prompt'; // Assume prompt if permissions API not available
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      return 'prompt';
    }
  }

  // Getter pour la position actuelle
  get currentPosition(): Position | null {
    return this.positionSubject.value;
  }

  // Getter pour l'état de suivi
  get isCurrentlyWatching(): boolean {
    return this.isWatching;
  }

  // Convertir degrés en radians
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Convertir radians en degrés
  private toDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  // Gérer les erreurs de géolocalisation
  private handleError(error: GeolocationPositionError): Error {
    let message = 'Erreur de géolocalisation inconnue';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'L\'accès à la géolocalisation a été refusé par l\'utilisateur';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Les informations de localisation ne sont pas disponibles';
        break;
      case error.TIMEOUT:
        message = 'La demande de géolocalisation a expiré';
        break;
    }

    return new Error(message);
  }

  // Nettoyer les ressources
  destroy(): void {
    this.stopWatching();
  }
}