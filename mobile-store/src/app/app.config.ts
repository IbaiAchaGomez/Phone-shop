import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { cacheInterceptor } from './persistence/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([cacheInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ]
};
