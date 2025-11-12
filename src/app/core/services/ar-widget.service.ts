import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { mockArWidgetResponse } from '../../data/mock-data';
import {
  ArWidgetApiResponse,
  ArWidgetRequestPayload,
} from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class ArWidgetService {
  private readonly api = inject(ApiHttpService);

  fetchWidget(payload: ArWidgetRequestPayload): Observable<ArWidgetApiResponse> {
    if (!this.api.isConfigured) {
      return of(mockArWidgetResponse);
    }

    let params = new HttpParams()
      .set('entityIds', payload.entityIds ?? '')
      .set('mode', payload.mode)
      .set('compare', payload.compare);

    if (payload.from) {
      params = params.set('from', payload.from);
    }
    if (payload.to) {
      params = params.set('to', payload.to);
    }
    if (payload.reportCcy) {
      params = params.set('reportCcy', payload.reportCcy);
    }

    return this.api
      .get<ArWidgetApiResponse>('/ar-widget', { params })
      .pipe(
        catchError((error) => {
          if (error instanceof ApiConnectionError) {
            console.warn(
              '[ArWidgetService] API unreachable, falling back to mock data.'
            );
            return of(mockArWidgetResponse);
          }
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError('Unable to load Accounts Receivable widget', error);
        })
      );
  }
}
