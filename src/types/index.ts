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

export type PeriodType = 'month' | 'quarter' | 'year' | 'rolling';

export interface Period {
  id: string;
  label: string;
  type: PeriodType;
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
  source?: string;
  statusReason?: string;
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

export type WidgetMode = 'month' | 'year' | 'custom';
export type WidgetCompareMode = 'prev_period' | 'yoy';

export interface ArWidgetRequestPayload {
  tenant: string;
  entityId?: number | null;
  mode: WidgetMode;
  from?: string | null;
  to?: string | null;
  compare: WidgetCompareMode;
  reportCcy?: string | null;
}

export interface ArWidgetFilters {
  to: string | null;
  from: string | null;
  mode: WidgetMode;
  compare: WidgetCompareMode;
  entity_id: number | null;
  report_ccy: string | null;
}

export interface ArWidgetMetrics {
  dso: {
    better_is: 'up' | 'down';
    delta_pct: number | null;
    value_days: number | null;
  };
  open_ar: {
    value: number | null;
    currency: string;
    delta_pct: number | null;
  };
}

export interface ArWidgetApiResponse {
  title: string;
  source: string;
  status: 'ok' | 'warning' | 'critical';
  status_reason: string;
  filters: ArWidgetFilters;
  metrics: ArWidgetMetrics;
}
