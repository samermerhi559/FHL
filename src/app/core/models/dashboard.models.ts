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
  entityIds: string[];
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
  hideStatus?: boolean;
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

export interface WidgetRequestPayload {
  entityIds: string;
  mode: WidgetMode;
  from?: string | null;
  to?: string | null;
  compare: WidgetCompareMode;
  reportCcy?: string | null;
}

export type ArWidgetRequestPayload = WidgetRequestPayload;
export type ApWidgetRequestPayload = WidgetRequestPayload;

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

export interface ApWidgetFilters {
  to: string | null;
  from: string | null;
  mode: WidgetMode;
  compare: WidgetCompareMode;
  entity_id: number | null;
  report_ccy: string | null;
}

export interface ApWidgetMetrics {
  dpo: {
    better_is: 'up' | 'down';
    delta_pct: number | null;
    value_days: number | null;
  };
  open_ap: {
    value: number | null;
    currency: string;
    delta_pct: number | null;
  };
}

export interface ApWidgetApiResponse {
  title: string;
  source: string;
  status: 'ok' | 'warning' | 'critical';
  status_reason: string;
  filters: ApWidgetFilters;
  metrics: ApWidgetMetrics;
}

export interface CashOutlookWeek {
  kind: 'actual' | 'projected';
  label: string;
  value: number | null;
  week_end: string;
  week_start?: string;
  week_index: number;
  actual?: number | null;
  projected?: number | null;
}

export interface CashOutlookSummary {
  cash_asof: number | null;
  min_balance_13w: number | null;
  will_breach_zero: boolean;
}

export interface CashOutlookResponse {
  as_of: string;
  title: string;
  weeks: CashOutlookWeek[];
  source: string;
  summary: CashOutlookSummary[];
  currency: string;
  entity_id: number | null;
}

export interface BoardOverviewFilters {
  as_of: string | null;
  entity_ids: number[];
  report_ccy: string | null;
}

export interface BoardOverviewRevenueYoyPoint {
  month: string;
  yoy_pct: number | null;
}

export interface BoardOverviewRevenueYoyFilters extends BoardOverviewFilters {
  months: number;
}

export interface BoardOverviewRevenueYoy {
  series: BoardOverviewRevenueYoyPoint[];
  filters: BoardOverviewRevenueYoyFilters;
}

export interface BoardOverviewRevenueRunRate {
  qtd: number | null;
  ttm: number | null;
  ytd: number | null;
  filters: BoardOverviewFilters;
  currency: string | null;
  latest_month: number | null;
  run_rate_annualized: number | null;
}

export interface BoardOverviewRevenue {
  yoy?: BoardOverviewRevenueYoy;
  run_rate?: BoardOverviewRevenueRunRate;
  status?: string | null;
}

export interface BoardOverviewTaxVatLatest {
  net: number | null;
  input: number | null;
  month: string | null;
  output: number | null;
}

export interface BoardOverviewTaxVatFilters extends BoardOverviewFilters {
  top_n?: number;
  months?: number;
}

export interface BoardOverviewTaxVat {
  latest: BoardOverviewTaxVatLatest;
  filters: BoardOverviewTaxVatFilters;
  status?: string | null;
}

export interface BoardOverviewLiquidity {
  cash: number | null;
  quick_ratio: number | null;
  status?: string | null;
}

export interface BoardOverviewFxTreasuryEntry {
  ccy: string;
  net: number;
}

export interface BoardOverviewFxTreasury {
  by_ccy: BoardOverviewFxTreasuryEntry[];
  filters: BoardOverviewFilters;
  total_net: number | null;
  status?: string | null;
}

export interface BoardOverviewConcentrationFilters
  extends BoardOverviewFilters {
  top_n: number;
  months: number;
}

export interface BoardOverviewConcentrationEntry {
  amount: number;
  share_pct: number;
  customer_id?: number;
  supplier_id?: number;
}

export interface BoardOverviewConcentrationGroup {
  top: BoardOverviewConcentrationEntry[];
  total: number;
  others: {
    amount: number;
    share_pct: number;
  };
  filters: BoardOverviewConcentrationFilters;
  currency: string | null;
}

export interface BoardOverviewConcentration {
  customers: BoardOverviewConcentrationGroup;
  suppliers: BoardOverviewConcentrationGroup;
  status?: string | null;
}

export interface BoardOverviewProfitability {
  ebitda_ttm: number | null;
  gross_margin_pct: number | null;
  ebitda_margin?: number | null;
  status?: string | null;
}

export interface BoardOverviewWorkingCapital {
  ap_open: number | null;
  ar_open: number | null;
  rev_ttm: number | null;
  ccc_days: number | null;
  cogs_ttm: number | null;
  dpo_days: number | null;
  dso_days: number | null;
  amount?: number | null;
  status?: string | null;
}

export interface BoardOverviewBalanceSheet {
  net_debt: number | null;
  debt_to_ebitda: number | null;
  interest_coverage: number | null;
  status?: string | null;
}

export interface BoardOverviewResponse {
  filters: BoardOverviewFilters;
  revenue?: BoardOverviewRevenue;
  tax_vat?: BoardOverviewTaxVat;
  liquidity?: BoardOverviewLiquidity;
  fx_treasury?: BoardOverviewFxTreasury;
  concentration?: BoardOverviewConcentration;
  profitability?: BoardOverviewProfitability;
  working_capital?: BoardOverviewWorkingCapital;
  balance_sheet_covenants?: BoardOverviewBalanceSheet;
}

export interface HeadlinesFilters {
  asof_month: string | null;
  entity_ids: number[];
  report_ccy: string | null;
}

export interface HeadlinesSignals {
  open_ap: number | null;
  open_ar: number | null;
  currency: string | null;
  dpo_days: number | null;
  dso_days: number | null;
  dpo_delta: number | null;
  dso_delta: number | null;
  rev_yoy_pct: number | null;
  interest_coverage: number | null;
  low_cash_next_13w: number | null;
  net_debt_to_ebitda: number | null;
}

export interface HeadlineEntry {
  code: string;
  level: string;
  message: string;
}

export interface HeadlinesResponse {
  filters: HeadlinesFilters;
  signals: HeadlinesSignals;
  headlines: HeadlineEntry[];
}
