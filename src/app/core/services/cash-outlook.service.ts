import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { mockCashOutlookResponse } from '../../data/mock-data';
import {
  CashOutlookResponse,
  CashOutlookSummary,
  CashOutlookWeek,
} from '../models/dashboard.models';
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

    return this.api
      .get<CashOutlookApiResponse>('/cash-13w', { params })
      .pipe(
        map((payload) => normalizeCashOutlookResponse(payload)),
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

interface CashOutlookApiWeek {
  week_end?: string;
  week_start?: string;
  week_index?: number;
  min_balance?: number;
  ending_balance?: number;
}

interface CashOutlookApiResponse {
  weeks?: CashOutlookApiWeek[];
  window?: {
    from?: string;
    to?: string;
  };
  filters?: {
    as_of?: string;
    weeks?: number;
    entity_ids?: number[];
    report_ccy?: string;
  };
  summary?: CashOutlookSummary | null;
  title?: string;
  source?: string;
  currency?: string;
}

const normalizeCashOutlookResponse = (
  payload: CashOutlookApiResponse
): CashOutlookResponse => {
  const asOf = payload.filters?.as_of ?? payload.window?.to ?? '';
  const summary = payload.summary ? [payload.summary] : [];
  const currency =
    payload.filters?.report_ccy ??
    payload.currency ??
    mockCashOutlookResponse.currency;
  const weeks = (payload.weeks ?? []).map((week, index) =>
    mapWeek(week, index, asOf)
  );
  return {
    as_of: asOf,
    title: payload.title ?? mockCashOutlookResponse.title,
    source: payload.source ?? 'api_cash_outlook',
    weeks,
    summary,
    currency,
    entity_id: payload.filters?.entity_ids?.[0] ?? null,
  };
};

const mapWeek = (
  week: CashOutlookApiWeek,
  index: number,
  asOf: string
): CashOutlookWeek => {
  const value = week.ending_balance ?? week.min_balance ?? 0;
  return {
    kind: resolveWeekKind(week, asOf),
    label: `W${(week.week_index ?? index) + 1}`,
    value,
    week_end: week.week_end ?? '',
  };
};

const resolveWeekKind = (
  week: CashOutlookApiWeek,
  asOf: string
): CashOutlookWeek['kind'] => {
  if (!week.week_end || !asOf) {
    return 'projected';
  }
  const weekEnd = new Date(week.week_end).getTime();
  const asOfDate = new Date(asOf).getTime();
  if (Number.isNaN(weekEnd) || Number.isNaN(asOfDate)) {
    return 'projected';
  }
  return weekEnd <= asOfDate ? 'actual' : 'projected';
};
