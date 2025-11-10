import { DatabaseConfig, loadDatabaseConfig } from '../db/config';
import { PostgresClient } from '../db/postgresClient';
import { TenantRepository } from '../repositories/tenantRepository';

export class TenantService {
  private readonly db: PostgresClient;
  private readonly repository: TenantRepository;

  constructor(config?: DatabaseConfig) {
    const resolvedConfig = config ?? loadDatabaseConfig();
    this.db = new PostgresClient(resolvedConfig);
    this.repository = new TenantRepository(this.db);
  }

  async getTenantDirectory() {
    try {
      return await this.repository.fetchTenantDirectory();
    } finally {
      await this.db.close();
    }
  }
}
