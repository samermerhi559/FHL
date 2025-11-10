export class ApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiConnectionError extends ApiError {
  constructor(message = 'API server is unreachable', cause?: unknown) {
    super(message, cause);
    this.name = 'ApiConnectionError';
  }
}
