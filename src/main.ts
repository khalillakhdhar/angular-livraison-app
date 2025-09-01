import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

// Enable offline Firestore persistence
import { initializeApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence, enableIndexedDbPersistence } from 'firebase/firestore';

if (environment.production) {
  enableProdMode();
}

// Initialize Firebase app and enable offline persistence
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);

// Enable offline persistence with fallback
enableMultiTabIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firestore: Failed to enable multi-tab persistence, falling back to single tab');
    enableIndexedDbPersistence(firestore).catch((error) => {
      console.error('Firestore: Failed to enable persistence:', error);
    });
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firestore: Persistence not supported in this browser');
  } else {
    console.error('Firestore: Failed to enable persistence:', err);
  }
});

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
