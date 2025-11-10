import { Pool, QueryResult } from 'pg';
import { DatabaseClient } from './baseClient';
import { DatabaseConfig } from './config';
import {
  DatabaseConnectionError,
  DatabaseQueryError,
} from './errors';

export class PostgresClient extends DatabaseClient {
  private readonly pool: Pool;

  constructor(config: DatabaseConfig) {
    super(config);
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
    });
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    try {
      const result: QueryResult<T> = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      if (this.isConnectivityIssue(error)) {
        throw new DatabaseConnectionError(undefined, error);
      }
      throw new DatabaseQueryError(undefined, error);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  private isConnectivityIssue(error: unknown): boolean {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error
    ) {
      const code = String((error as { code?: string }).code);
      return ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(code);
    }
    return false;
  }
}
