import { mockApWidgetResponse } from '../../lib/mockData';
import {
  ApWidgetApiResponse,
  ApWidgetRequestPayload,
} from '../../types';
import { ApiConnectionError, ApiError } from './errors';
import { HttpClient } from './httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WIDGET_ENDPOINT = '/ap-widget';

class ApWidgetService {
  private readonly client?: HttpClient;

  constructor() {
    if (API_BASE_URL) {
      this.client = new HttpClient(API_BASE_URL);
    }
  }

  async fetchWidget(
    payload: ApWidgetRequestPayload,
    signal?: AbortSignal
  ): Promise<ApWidgetApiResponse> {
    if (!this.client) {
      return mockApWidgetResponse;
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

      return await this.client.request<ApWidgetApiResponse>(
        `${WIDGET_ENDPOINT}?${params.toString()}`,
        {
          method: 'GET',
          signal,
        }
      );
    } catch (error) {
      if (error instanceof ApiConnectionError) {
        console.warn(
          '[ApWidgetService] API unreachable, using mock data fallback.'
        );
        return mockApWidgetResponse;
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Unable to load Accounts Payable widget', error);
    }
  }
}

export const apWidgetService = new ApWidgetService();
