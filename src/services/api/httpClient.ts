import { ApiConnectionError, ApiError } from './errors';

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'GET',
    });
  }

  async request<T>(path: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorBody = await this.safeParse(response);
        throw new ApiError(
          errorBody?.message || `API request failed with status ${response.status}`
        );
      }
      return (await this.safeParse(response)) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      if (error instanceof TypeError) {
        throw new ApiConnectionError(undefined, error);
      }
      throw new ApiError('Unexpected API error', error);
    }
  }

  private async safeParse(response: Response) {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}
