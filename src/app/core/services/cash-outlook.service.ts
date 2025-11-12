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
    entityIds: string,
    reportCcy?: string | null
  ): Observable<CashOutlookResponse> {
    if (!this.api.isConfigured) {
      return of(mockCashOutlookResponse);
    }

    let params = new HttpParams().set('entityIds', entityIds ?? '');
    if (reportCcy) {
      params = params.set('reportCcy', reportCcy);
    }

    return this.api.get<CashOutlookResponse>('/cash-13w', { params }).pipe(
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
