import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

// 👉 Import the theme preset from @primeng/themes
import Lara from '@primeng/themes/lara';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          colorScheme: 'light-blue'   
        }
      }
    })
  ]
};
