export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message = 'Unable to reach the database server', cause?: unknown) {
    super(message, cause);
    this.name = 'DatabaseConnectionError';
  }
}

export class DatabaseQueryError extends DatabaseError {
  constructor(message = 'Database query failed', cause?: unknown) {
    super(message, cause);
    this.name = 'DatabaseQueryError';
  }
}
