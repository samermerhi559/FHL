import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { mockTenantDirectory } from '../../data/mock-tenant-directory';
import { TenantDirectoryEntry } from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

type DirectoryResponse =
  | TenantDirectoryEntry[]
  | { data: TenantDirectoryEntry[] };

@Injectable({
  providedIn: 'root',
})
export class TenantDirectoryService {
  private readonly api = inject(ApiHttpService);
  private readonly defaultTenant =
    environment.defaultTenant?.trim() ?? 'Omega';

  fetchDirectory(): Observable<TenantDirectoryEntry[]> {
    if (!this.api.isConfigured) {
      return of(mockTenantDirectory);
    }

    const params = new HttpParams().set('tenant', this.defaultTenant);

    return this.api.get<DirectoryResponse>('/tenant-directory', { params }).pipe(
      map((payload) =>
        Array.isArray(payload) ? payload : payload?.data ?? []
      ),
      catchError((error) => {
        if (
          error instanceof ApiConnectionError ||
          error instanceof ApiError
        ) {
          console.warn(
            '[TenantDirectoryService] Falling back to mock directory data because:',
            error.message
          );
          return of(mockTenantDirectory);
        }
        throw error;
      })
    );
  }
}
