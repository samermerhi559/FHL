// Core types for the financial dashboard

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface Entity {
  id: string;
  name: string;
  type: 'subsidiary' | 'division' | 'consolidated';
  directoryEntityId?: number;
  tenantId?: number;
  countryCode?: string;
  baseCurrency?: string;
}

export interface Period {
  id: string;
  label: string;
  type: 'month' | 'quarter' | 'rolling';
}

export interface TenantDirectoryEntity {
  name: string;
  entity_id: number;
  country_code: string;
  base_currency: string;
}

export interface TenantDirectoryEntry {
  tenant_id: number;
  tenant_name: string;
  entities: TenantDirectoryEntity[];
}

export interface TenantSummary {
  id: number;
  name: string;
}

export interface GlobalFilters {
  tenant?: TenantSummary;
  entity?: Entity;
  period: Period;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'flat';
  status?: HealthStatus;
}

export interface SectionConfig {
  id: string;
  name: string;
  icon: string;
  status: HealthStatus;
  kpis: KPI[];
  sparklineData?: number[];
}

export interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  section: string;
  timestamp: Date;
  isRead: boolean;
}
