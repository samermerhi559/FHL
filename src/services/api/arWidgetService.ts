import { mockArWidgetResponse } from '../../lib/mockData';
import {
  ArWidgetApiResponse,
  ArWidgetRequestPayload,
} from '../../types';
import { ApiConnectionError, ApiError } from './errors';
import { HttpClient } from './httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WIDGET_ENDPOINT = '/ar-widget';

class ArWidgetService {
  private readonly client?: HttpClient;

  constructor() {
    if (API_BASE_URL) {
      this.client = new HttpClient(API_BASE_URL);
    }
  }

  async fetchWidget(
    payload: ArWidgetRequestPayload,
    signal?: AbortSignal
  ): Promise<ArWidgetApiResponse> {
    if (!this.client) {
      return mockArWidgetResponse;
    }

    try {
      const params = new URLSearchParams({
        tenant: payload.tenant,
        mode: payload.mode,
        compare: payload.compare,
      });

      if (payload.entityId !== null && payload.entityId !== undefined) {
        params.set('entityId', String(payload.entityId));
      }
      if (payload.from) {
        params.set('from', payload.from);
      }
      if (payload.to) {
        params.set('to', payload.to);
      }
      if (payload.reportCcy) {
        params.set('reportCcy', payload.reportCcy);
      }

      return await this.client.request<ArWidgetApiResponse>(
        `${WIDGET_ENDPOINT}?${params.toString()}`,
        {
          method: 'GET',
          signal,
        }
      );
    } catch (error) {
      if (error instanceof ApiConnectionError) {
        console.warn(
          '[ArWidgetService] API unreachable, using mock data fallback.'
        );
        return mockArWidgetResponse;
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Unable to load Accounts Receivable widget', error);
    }
  }
}

export const arWidgetService = new ArWidgetService();
