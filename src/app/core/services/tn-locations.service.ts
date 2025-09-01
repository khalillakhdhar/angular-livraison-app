import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TunisianLocations, Gouvernorat, Ville } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class TnLocationsService {
  private locationsSubject = new BehaviorSubject<TunisianLocations | null>(null);
  public locations$ = this.locationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLocations();
  }

  private loadLocations(): void {
    this.http.get<TunisianLocations>('/assets/tn-locations.json').pipe(
      tap(locations => this.locationsSubject.next(locations))
    ).subscribe();
  }

  getGouvernorats(): Observable<Gouvernorat[]> {
    return this.locations$.pipe(
      map(locations => locations?.gouvernorats || [])
    );
  }

  getVillesByGouvernorat(gouvernoratId: string): Observable<Ville[]> {
    return this.locations$.pipe(
      map(locations => {
        const gouvernorat = locations?.gouvernorats.find(g => g.id === gouvernoratId);
        return gouvernorat?.villes || [];
      })
    );
  }

  getGouvernoratById(id: string): Observable<Gouvernorat | null> {
    return this.locations$.pipe(
      map(locations => {
        return locations?.gouvernorats.find(g => g.id === id) || null;
      })
    );
  }

  getVilleById(gouvernoratId: string, villeId: string): Observable<Ville | null> {
    return this.getVillesByGouvernorat(gouvernoratId).pipe(
      map(villes => villes.find(v => v.id === villeId) || null)
    );
  }

  searchVilles(searchTerm: string): Observable<Ville[]> {
    return this.locations$.pipe(
      map(locations => {
        if (!locations || !searchTerm) return [];
        
        const allVilles: Ville[] = [];
        locations.gouvernorats.forEach(gouvernorat => {
          allVilles.push(...gouvernorat.villes);
        });
        
        return allVilles.filter(ville => 
          ville.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }
}