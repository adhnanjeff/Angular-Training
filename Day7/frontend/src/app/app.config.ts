// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

// 👇 Import the theme you want (choose one)
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Handle global errors
    provideBrowserGlobalErrorListeners(),

    // Optimize change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // App routes
    provideRouter(routes),

    // Async animations for PrimeNG
    provideAnimationsAsync(),

    // PrimeNG theme — pick Aura OR Lara
    providePrimeNG({
      theme: {
        preset: Lara // or Aura
      }
    })
  ]
};
