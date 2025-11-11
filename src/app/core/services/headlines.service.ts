import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { mockHeadlinesResponse } from '../../data/mock-data';
import { HeadlinesResponse } from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class HeadlinesService {
  private readonly api = inject(ApiHttpService);

  fetchHeadlines(
    tenant: string,
    entityId: number
  ): Observable<HeadlinesResponse> {
    if (!this.api.isConfigured) {
      return of(mockHeadlinesResponse);
    }

    const params = new HttpParams()
      .set('tenant', tenant)
      .set('entityId', entityId);

    return this.api
      .get<HeadlinesResponse>('/signals/headlines', { params })
      .pipe(
        catchError((error) => {
          if (error instanceof ApiConnectionError) {
            console.warn(
              '[HeadlinesService] API unreachable, falling back to mock data.'
            );
            return of(mockHeadlinesResponse);
          }
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError('Unable to load signal headlines', error);
        })
      );
  }
}
