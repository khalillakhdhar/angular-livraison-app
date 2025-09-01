import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Environment
import { environment } from './environments/environment';

// App component and routes
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // Router
    provideRouter(routes),
    
    // Animations
    importProvidersFrom(BrowserAnimationsModule),
    
    // Firebase
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(
      provideAuth(() => getAuth())
    ),
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    )
  ]
}).catch(err => console.error(err));