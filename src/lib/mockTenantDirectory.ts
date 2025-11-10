import { TenantDirectoryEntry } from '../types';

export const mockTenantDirectory: TenantDirectoryEntry[] = [
  {
    tenant_id: 1,
    tenant_name: 'Alpha',
    entities: [
      {
        name: 'Alpha',
        entity_id: 4,
        country_code: 'DE',
        base_currency: 'EUR',
      },
    ],
  },
  {
    tenant_id: 2,
    tenant_name: 'Omega',
    entities: [
      {
        name: 'Omega',
        entity_id: 6,
        country_code: 'DE',
        base_currency: 'EUR',
      },
    ],
  },
  {
    tenant_id: 3,
    tenant_name: 'Beta',
    entities: [
      {
        name: 'Beta',
        entity_id: 5,
        country_code: 'DE',
        base_currency: 'EUR',
      },
    ],
  },
];
