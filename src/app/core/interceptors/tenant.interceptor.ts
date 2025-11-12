import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardStateService } from '../services/dashboard-state.service';

const apiBaseUrl = environment.apiBaseUrl?.trim() ?? '';
const defaultTenantId = environment.defaultTenantId?.toString().trim();

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const state = inject(DashboardStateService);
  if (!apiBaseUrl || !req.url.startsWith(apiBaseUrl)) {
    return next(req);
  }

  const hasHeader =
    req.headers.has('X-Tenant-Id') || req.headers.has('x-tenant-id');

  if (hasHeader) {
    return next(req);
  }

  const tenantId =
    state.filters().tenant?.id?.toString() ??
    req.params.get('X-Tenant-Id') ??
    defaultTenantId ??
    undefined;

  if (!tenantId) {
    return next(req);
  }

  const headers = req.headers.set('X-Tenant-Id', tenantId);
  return next(req.clone({ headers }));
};
