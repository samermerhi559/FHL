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
  ending_balance_actual?: number | null;
  ending_balance_projected?: number | null;
}

interface CashOutlookApiSummary {
  cash_asof?: number | null;
  min_balance_13w?: number | null;
  will_breach_zero?: boolean;
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
  summary?: CashOutlookApiSummary | null;
  title?: string;
  source?: string;
  currency?: string;
}

const normalizeCashOutlookResponse = (
  payload: CashOutlookApiResponse
): CashOutlookResponse => {
  const asOf = payload.filters?.as_of ?? payload.window?.to ?? '';
  const summary = payload.summary ? [mapSummary(payload.summary)] : [];
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
  const actual =
    week.ending_balance_actual ?? week.ending_balance ?? week.min_balance ?? null;
  const projected = week.ending_balance_projected ?? null;
  const labelIndex = week.week_index ?? index;
  const value = actual ?? projected ?? 0;
  return {
    kind: resolveWeekKind(week, asOf, actual),
    label: `W${labelIndex + 1}`,
    value,
    week_end: week.week_end ?? '',
    week_start: week.week_start ?? '',
    week_index: labelIndex,
    actual,
    projected,
  };
};

const resolveWeekKind = (
  week: CashOutlookApiWeek,
  asOf: string,
  actualValue: number | null
): CashOutlookWeek['kind'] => {
  if (actualValue !== null && actualValue !== undefined) {
    return 'actual';
  }
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

const mapSummary = (
  summary: CashOutlookApiSummary
): CashOutlookSummary => ({
  cash_asof: summary.cash_asof ?? null,
  min_balance_13w: summary.min_balance_13w ?? null,
  will_breach_zero: !!summary.will_breach_zero,
});
