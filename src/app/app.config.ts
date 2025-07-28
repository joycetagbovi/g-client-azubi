import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi , HTTP_INTERCEPTORS} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';
import {AuthInterceptor} from './core/interceptors/auth.interceptors';
import {AuthService} from './core/services/auth.service';
import {AuthGuard} from './core/guards/auth.guard';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
      preset: Aura,
      }
    }),
    AuthService,
    MessageService,
    {provide:  HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
};
