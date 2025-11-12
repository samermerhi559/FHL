import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { mockApWidgetResponse } from '../../data/mock-data';
import {
  ApWidgetApiResponse,
  ApWidgetRequestPayload,
} from '../models/dashboard.models';
import { ApiConnectionError, ApiError } from './api-errors';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class ApWidgetService {
  private readonly api = inject(ApiHttpService);

  fetchWidget(payload: ApWidgetRequestPayload): Observable<ApWidgetApiResponse> {
    if (!this.api.isConfigured) {
      return of(mockApWidgetResponse);
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
      .get<ApWidgetApiResponse>('/ap-widget', { params })
      .pipe(
        catchError((error) => {
          if (error instanceof ApiConnectionError) {
            console.warn(
              '[ApWidgetService] API unreachable, falling back to mock data.'
            );
            return of(mockApWidgetResponse);
          }
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError('Unable to load Accounts Payable widget', error);
        })
      );
  }
}
