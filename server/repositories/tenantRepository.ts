import { DatabaseClient } from '../db/baseClient';

interface TenantDirectoryRow {
  api_tenant_directory_json: unknown;
}

export class TenantRepository {
  private static readonly DIRECTORY_QUERY =
    'SELECT fhl2.api_tenant_directory_json() as api_tenant_directory_json;';

  constructor(private readonly db: DatabaseClient) {}

  async fetchTenantDirectory() {
    const rows = await this.db.query<TenantDirectoryRow>(
      TenantRepository.DIRECTORY_QUERY
    );
    const payload = rows[0]?.api_tenant_directory_json;
    if (Array.isArray(payload)) {
      return payload;
    }
    return [];
  }
}
