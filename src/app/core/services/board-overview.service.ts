import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { mockBoardOverviewResponse } from '../../data/mock-data';
import { BoardOverviewResponse } from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class BoardOverviewService {
  private readonly api = inject(ApiHttpService);

  fetchBoardOverview(
    entityIds: string,
    asOf?: string | null,
    reportCcy?: string | null
  ): Observable<BoardOverviewResponse> {
    if (!this.api.isConfigured) {
      return of(mockBoardOverviewResponse);
    }

    let params = new HttpParams().set('entityIds', entityIds ?? '');
    if (asOf) {
      params = params.set('asOf', asOf);
    }
    if (reportCcy) {
      params = params.set('reportCcy', reportCcy);
    }

    return this.api.get<BoardOverviewResponse>('/board-overview', { params }).pipe(
      catchError((error) => {
        if (error instanceof ApiConnectionError) {
          console.warn(
            '[BoardOverviewService] API unreachable, falling back to mock data.'
          );
          return of(mockBoardOverviewResponse);
        }
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('Unable to load board overview', error);
      })
    );
  }
}
