import { mockTenantDirectory } from '../../lib/mockTenantDirectory';
import { TenantDirectoryEntry } from '../../types';
import { ApiConnectionError, ApiError } from './errors';
import { HttpClient } from './httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_TENANT =
  import.meta.env.VITE_DEFAULT_TENANT || 'Omega';
const DIRECTORY_ENDPOINT = '/tenant-directory';

type DirectoryResponse =
  | TenantDirectoryEntry[]
  | { data: TenantDirectoryEntry[] };

class TenantDirectoryService {
  private readonly client?: HttpClient;

  constructor() {
    if (API_BASE_URL) {
      this.client = new HttpClient(API_BASE_URL);
    }
  }

  async fetchDirectory(signal?: AbortSignal): Promise<TenantDirectoryEntry[]> {
    if (!this.client) {
      return mockTenantDirectory;
    }

    const tenant = DEFAULT_TENANT;
    if (!tenant) {
      console.warn(
        '[TenantDirectoryService] Missing VITE_DEFAULT_TENANT, falling back to mock directory.'
      );
      return mockTenantDirectory;
    }

    const query = new URLSearchParams({ tenant }).toString();

    try {
      const payload = await this.client.get<DirectoryResponse>(
        `${DIRECTORY_ENDPOINT}?${query}`,
        { signal }
      );
      if (Array.isArray(payload)) {
        return payload;
      }
      return payload?.data ?? [];
    } catch (error) {
      if (error instanceof ApiConnectionError) {
        console.warn(
          '[TenantDirectoryService] API unreachable, using mock data fallback.'
        );
        return mockTenantDirectory;
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Unable to load tenant directory', error);
    }
  }
}

export const tenantDirectoryService = new TenantDirectoryService();
