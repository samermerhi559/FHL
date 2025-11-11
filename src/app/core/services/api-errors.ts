export class ApiError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
  }
}

export class ApiConnectionError extends ApiError {
  constructor(message = 'API server is unreachable', cause?: unknown) {
    super(message, cause);
    this.name = 'ApiConnectionError';
  }
}
