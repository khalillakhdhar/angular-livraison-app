import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { GeolocationService, Position } from '../../core/services/geolocation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livreur-carte',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carte-container">
      <div class="carte-header">
        <h2>Carte de Livraison</h2>
        <div class="carte-controls">
          <div class="location-status" [class.active]="isTrackingLocation">
            <i class="material-icons">{{ isTrackingLocation ? 'gps_fixed' : 'gps_off' }}</i>
            <span>{{ isTrackingLocation ? 'Géolocalisation active' : 'Géolocalisation inactive' }}</span>
          </div>
          
          <button 
            class="neon-btn" 
            [class.success]="!isTrackingLocation"
            [class.warning]="isTrackingLocation"
            (click)="toggleLocationTracking()"
          >
            <i class="material-icons">{{ isTrackingLocation ? 'gps_off' : 'gps_fixed' }}</i>
            {{ isTrackingLocation ? 'Arrêter' : 'Démarrer' }} le suivi
          </button>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-section">
        <div #mapContainer class="map-container" id="delivery-map"></div>
        
        <!-- Position Info Panel -->
        <div class="position-panel glass-card" *ngIf="currentPosition">
          <h3>Position Actuelle</h3>
          <div class="position-info">
            <div class="position-item">
              <i class="material-icons">my_location</i>
              <div class="position-details">
                <div class="position-label">Coordonnées</div>
                <div class="position-value">
                  {{ currentPosition.latitude.toFixed(6) }}, {{ currentPosition.longitude.toFixed(6) }}
                </div>
              </div>
            </div>
            
            <div class="position-item">
              <i class="material-icons">accuracy</i>
              <div class="position-details">
                <div class="position-label">Précision</div>
                <div class="position-value">{{ currentPosition.accuracy.toFixed(0) }}m</div>
              </div>
            </div>
            
            <div class="position-item" *ngIf="currentPosition.speed !== null">
              <i class="material-icons">speed</i>
              <div class="position-details">
                <div class="position-label">Vitesse</div>
                <div class="position-value">{{ ((currentPosition.speed || 0) * 3.6).toFixed(1) }} km/h</div>
              </div>
            </div>
            
            <div class="position-item">
              <i class="material-icons">access_time</i>
              <div class="position-details">
                <div class="position-label">Dernière mise à jour</div>
                <div class="position-value">{{ formatTime(currentPosition.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Destinations fictives -->
      <div class="destinations-panel glass-card">
        <h3>Destinations Exemple</h3>
        <p class="destinations-note">
          Cliquez sur une destination pour l'afficher sur la carte
        </p>
        
        <div class="destinations-list">
          <div 
            class="destination-item" 
            *ngFor="let dest of exampleDestinations"
            (click)="flyToDestination(dest)"
          >
            <div class="destination-icon">
              <i class="material-icons">place</i>
            </div>
            <div class="destination-info">
              <div class="destination-name">{{ dest.name }}</div>
              <div class="destination-address">{{ dest.address }}</div>
            </div>
            <div class="destination-distance" *ngIf="currentPosition">
              {{ calculateDistance(dest.lat, dest.lng) }} km
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carte-container {
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
      animation: fadeInUp 0.6s ease-out;
    }

    .carte-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .carte-header h2 {
      margin: 0;
      color: var(--neon-green);
    }

    .carte-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .location-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: rgba(255, 0, 255, 0.2);
      border: 1px solid var(--neon-magenta);
      color: var(--neon-magenta);
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .location-status.active {
      background: rgba(0, 255, 0, 0.2);
      border-color: var(--neon-green);
      color: var(--neon-green);
    }

    .location-status i {
      font-size: 1.1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .map-section {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
      min-height: 0;
    }

    .map-container {
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid rgba(0, 255, 0, 0.3);
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.2);
      height: 100%;
    }

    .position-panel {
      padding: 1.5rem;
      height: fit-content;
    }

    .position-panel h3 {
      margin: 0 0 1.5rem 0;
      color: var(--neon-green);
      font-size: 1.2rem;
    }

    .position-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .position-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .position-item i {
      color: var(--neon-green);
      font-size: 1.2rem;
      margin-top: 0.1rem;
    }

    .position-details {
      flex: 1;
    }

    .position-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.25rem;
    }

    .position-value {
      color: var(--text-primary);
      font-weight: 600;
      font-family: var(--font-primary);
    }

    .destinations-panel {
      grid-column: 1 / -1;
      padding: 1.5rem;
      margin-top: 1.5rem;
    }

    .destinations-panel h3 {
      margin: 0 0 0.5rem 0;
      color: var(--neon-green);
      font-size: 1.2rem;
    }

    .destinations-note {
      color: var(--text-secondary);
      margin: 0 0 1.5rem 0;
      font-size: 0.9rem;
    }

    .destinations-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .destination-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 0, 255, 0.05);
      border: 1px solid rgba(255, 0, 255, 0.2);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .destination-item:hover {
      background: rgba(255, 0, 255, 0.1);
      border-color: var(--neon-magenta);
      transform: translateY(-2px);
    }

    .destination-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 0, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--neon-magenta);
    }

    .destination-icon i {
      color: var(--neon-magenta);
      font-size: 1.2rem;
    }

    .destination-info {
      flex: 1;
    }

    .destination-name {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .destination-address {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .destination-distance {
      color: var(--neon-green);
      font-weight: 600;
      font-family: var(--font-primary);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .map-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .carte-header {
        flex-direction: column;
        align-items: stretch;
      }

      .carte-controls {
        justify-content: space-between;
      }

      .destinations-list {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .carte-container {
        height: calc(100vh - 160px);
      }

      .destinations-panel {
        padding: 1rem;
      }

      .position-panel {
        padding: 1rem;
      }
    }

    /* Leaflet custom styles */
    :host ::ng-deep .leaflet-container {
      background: var(--dark-bg);
    }

    :host ::ng-deep .leaflet-control-zoom {
      border: none;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }

    :host ::ng-deep .leaflet-control-zoom a {
      background: var(--glass-bg);
      border: 1px solid rgba(0, 255, 0, 0.3);
      color: var(--neon-green);
      font-weight: bold;
    }

    :host ::ng-deep .leaflet-control-zoom a:hover {
      background: rgba(0, 255, 0, 0.1);
      border-color: var(--neon-green);
    }
  `]
})
export class LivreurCarteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private deliveryMarker: L.Marker | null = null;
  private destinationMarkers: L.Marker[] = [];
  private subscription = new Subscription();

  currentPosition: Position | null = null;
  isTrackingLocation = false;

  // Destinations d'exemple
  exampleDestinations = [
    {
      name: 'Restaurant Le Gourmet',
      address: '123 Rue de la Paix, Paris',
      lat: 48.8566,
      lng: 2.3522
    },
    {
      name: 'Pharmacie Centrale',
      address: '45 Avenue des Champs, Paris',
      lat: 48.8738,
      lng: 2.2950
    },
    {
      name: 'Supermarché Fresh',
      address: '78 Boulevard Saint-Germain, Paris',
      lat: 48.8534,
      lng: 2.3488
    },
    {
      name: 'Bureau de Poste',
      address: '12 Place de la République, Paris',
      lat: 48.8673,
      lng: 2.3633
    }
  ];

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit(): void {
    this.checkGeolocationPermissions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.isTrackingLocation) {
      this.geolocationService.stopWatching();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private async checkGeolocationPermissions(): Promise<void> {
    const permission = await this.geolocationService.checkPermissions();
    console.log('Geolocation permission:', permission);
  }

  private initMap(): void {
    // Position par défaut (Paris)
    const defaultLat = 48.8566;
    const defaultLng = 2.3522;

    this.map = L.map('delivery-map').setView([defaultLat, defaultLng], 13);

    // Tile layer avec style sombre
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Ajouter les destinations d'exemple
    this.addExampleDestinations();
  }

  private addExampleDestinations(): void {
    if (!this.map) return;

    this.exampleDestinations.forEach(dest => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: this.createDestinationIcon()
      }).addTo(this.map!);

      marker.bindPopup(`
        <div style="color: #000; font-family: Arial;">
          <strong>${dest.name}</strong><br>
          ${dest.address}
        </div>
      `);

      this.destinationMarkers.push(marker);
    });
  }

  private createDeliveryIcon(): L.Icon {
    return L.divIcon({
      className: 'delivery-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background: #00ff00;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
        ">
          <i class="material-icons" style="color: #000; font-size: 16px;">delivery_dining</i>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  private createDestinationIcon(): L.Icon {
    return L.divIcon({
      className: 'destination-marker',
      html: `
        <div style="
          width: 25px;
          height: 25px;
          background: #ff00ff;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.6);
        "></div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5]
    });
  }

  toggleLocationTracking(): void {
    if (this.isTrackingLocation) {
      this.stopLocationTracking();
    } else {
      this.startLocationTracking();
    }
  }

  private startLocationTracking(): void {
    if (!this.geolocationService.isGeolocationAvailable()) {
      alert('La géolocalisation n\'est pas disponible sur ce navigateur');
      return;
    }

    try {
      const positionSub = this.geolocationService.startWatching().subscribe(
        position => {
          this.currentPosition = position;
          this.updateDeliveryMarker(position);
        },
        error => {
          console.error('Erreur géolocalisation:', error);
          alert('Erreur lors de l\'accès à la géolocalisation: ' + error.message);
        }
      );

      this.subscription.add(positionSub);
      this.isTrackingLocation = true;
    } catch (error: any) {
      console.error('Erreur démarrage géolocalisation:', error);
      alert('Impossible de démarrer la géolocalisation: ' + error.message);
    }
  }

  private stopLocationTracking(): void {
    this.geolocationService.stopWatching();
    this.isTrackingLocation = false;
  }

  private updateDeliveryMarker(position: Position): void {
    if (!this.map) return;

    if (this.deliveryMarker) {
      this.deliveryMarker.setLatLng([position.latitude, position.longitude]);
    } else {
      this.deliveryMarker = L.marker([position.latitude, position.longitude], {
        icon: this.createDeliveryIcon()
      }).addTo(this.map);

      this.deliveryMarker.bindPopup(`
        <div style="color: #000; font-family: Arial;">
          <strong>Ma Position</strong><br>
          Lat: ${position.latitude.toFixed(6)}<br>
          Lng: ${position.longitude.toFixed(6)}<br>
          Précision: ${position.accuracy.toFixed(0)}m
        </div>
      `);

      // Centrer la carte sur la position du livreur
      this.map.setView([position.latitude, position.longitude], 15);
    }
  }

  flyToDestination(destination: any): void {
    if (!this.map) return;

    this.map.flyTo([destination.lat, destination.lng], 16, {
      duration: 1.5
    });

    // Ouvrir le popup de la destination
    const marker = this.destinationMarkers.find(m => {
      const pos = m.getLatLng();
      return pos.lat === destination.lat && pos.lng === destination.lng;
    });

    if (marker) {
      marker.openPopup();
    }
  }

  calculateDistance(lat: number, lng: number): string {
    if (!this.currentPosition) return '-';

    const distance = this.geolocationService.calculateDistance(
      this.currentPosition,
      { latitude: lat, longitude: lng }
    );

    return distance.toFixed(1);
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}