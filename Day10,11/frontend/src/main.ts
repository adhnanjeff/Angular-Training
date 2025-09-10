import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptor } from './app/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { inject } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(), 
      withInterceptors([
        jwtInterceptor.withToken,
        (req, next) => {
          const messageService = inject(MessageService);
          const router = inject(Router);
          return ErrorInterceptor.withErrorHandling(messageService, router)(req, next);
        }
      ])
    ),
    MessageService,
    ConfirmationService
  ]
}).catch(err => console.error(err));
