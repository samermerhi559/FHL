import { DatabaseConfig } from './config';

export abstract class DatabaseClient {
  protected constructor(protected readonly config: DatabaseConfig) {}

  abstract query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;

  abstract close(): Promise<void>;
}
