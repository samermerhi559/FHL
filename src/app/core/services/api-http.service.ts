import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiConnectionError, ApiError } from './api-errors';

interface RequestOptions {
  params?: HttpParams;
}

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl?.trim() ?? '';

  get isConfigured(): boolean {
    return Boolean(this.baseUrl);
  }

  get<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.request<T>('GET', path, options);
  }

  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: RequestOptions = {}
  ): Observable<T> {
    if (!this.isConfigured) {
      return throwError(
        () => new ApiError('API base URL not configured for this environment')
      );
    }

    const url = `${this.baseUrl}${path}`;
    return this.http
      .request<T>(method, url, {
        params: options.params,
      })
      .pipe(
        catchError((error) => throwError(() => this.normalizeError(error)))
      );
  }

  private normalizeError(error: HttpErrorResponse): ApiError {
    if (error.status === 0) {
      return new ApiConnectionError('API server is unreachable', error);
    }
    if (error.error instanceof ErrorEvent) {
      return new ApiError(error.error.message, error);
    }
    const message =
      error.error?.message ||
      error.error?.title ||
      `API request failed with status ${error.status}`;
    return new ApiError(message, error);
  }
}
