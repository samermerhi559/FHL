import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

import { routes } from './app.routes';
import { tenantInterceptor } from './core/interceptors/tenant.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tenantInterceptor])),
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') },
    },
  ],
};
