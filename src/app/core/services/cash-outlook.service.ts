import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { mockCashOutlookResponse } from '../../data/mock-data';
import { CashOutlookResponse } from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class CashOutlookService {
  private readonly api = inject(ApiHttpService);

  fetchCashOutlook(
    tenant: string,
    entityId: number
  ): Observable<CashOutlookResponse> {
    if (!this.api.isConfigured) {
      return of(mockCashOutlookResponse);
    }

    const params = new HttpParams()
      .set('tenant', tenant)
      .set('entityId', entityId);

    return this.api
      .get<CashOutlookResponse>('/cash-13w-weeks', { params })
      .pipe(
        catchError((error) => {
          if (error instanceof ApiConnectionError) {
            console.warn(
              '[CashOutlookService] API unreachable, falling back to mock data.'
            );
            return of(mockCashOutlookResponse);
          }
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError('Unable to load cash outlook data', error);
        })
      );
  }
}
