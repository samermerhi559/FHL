import {
  Alert,
  ApWidgetApiResponse,
  ArWidgetApiResponse,
  CashOutlookResponse,
  HealthStatus,
  Period,
  SectionConfig,
} from '../core/models/dashboard.models';

export const mockPeriods: Period[] = [
  { id: 'current-month', label: 'Current Month', type: 'month' },
  { id: 'current-quarter', label: 'This Quarter', type: 'quarter' },
  { id: 'current-year', label: 'This Year', type: 'year' },
];

export const mockSections: SectionConfig[] = [
  {
    id: 'liquidity',
    name: 'Liquidity',
    icon: 'Droplets',
    status: 'healthy',
    kpis: [
      { label: 'Cash Position', value: '$24.3M', change: 8.2, trend: 'up' },
      { label: 'Quick Ratio', value: '2.4x', change: 0.3, trend: 'up' },
    ],
    sparklineData: [20, 21, 19, 22, 23, 22, 24],
  },
  {
    id: 'ar',
    name: 'Accounts Receivable',
    icon: 'ArrowDownToLine',
    status: 'warning',
    kpis: [
      { label: 'DSO', value: '--', status: 'warning' },
      { label: 'Open AR', value: '--' },
    ],
    sparklineData: [7.8, 8.0, 7.9, 8.1, 8.3, 8.2, 8.2],
    source: 'api_ar',
  },
  {
    id: 'ap',
    name: 'Accounts Payable',
    icon: 'ArrowUpToLine',
    status: 'healthy',
    kpis: [
      { label: 'DPO', value: '--' },
      { label: 'Open AP', value: '--' },
    ],
    sparklineData: [5.2, 5.0, 4.9, 4.8, 4.7, 4.6, 4.6],
    source: 'api_ap',
  },
  {
    id: 'profitability',
    name: 'Profitability',
    icon: 'TrendingUp',
    status: 'healthy',
    kpis: [
      { label: 'Gross Margin', value: '68%', change: 2.1, trend: 'up' },
      { label: 'EBITDA', value: '$5.2M', change: 12.3, trend: 'up' },
    ],
    sparklineData: [4.5, 4.7, 4.9, 5.0, 5.1, 5.3, 5.2],
  },
  {
    id: 'working-capital',
    name: 'Working Capital',
    icon: 'Repeat',
    status: 'healthy',
    kpis: [
      { label: 'WC Days', value: '28 days', change: -3, trend: 'down' },
      { label: 'WC Amount', value: '$6.8M', change: 4.2, trend: 'up' },
    ],
    sparklineData: [6.2, 6.4, 6.5, 6.6, 6.7, 6.9, 6.8],
  },
  {
    id: 'revenue-health',
    name: 'Revenue Health',
    icon: 'DollarSign',
    status: 'healthy',
    kpis: [
      { label: 'MRR', value: '$3.2M', change: 6.8, trend: 'up' },
      { label: 'Churn Rate', value: '2.1%', change: -0.3, trend: 'down' },
    ],
    sparklineData: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2, 3.2],
  },
  {
    id: 'fx-treasury',
    name: 'FX & Treasury',
    icon: 'Coins',
    status: 'warning',
    kpis: [
      {
        label: 'FX Exposure',
        value: '$12.4M',
        change: 8.5,
        trend: 'up',
        status: 'warning',
      },
      { label: 'Hedged %', value: '62%', change: -3, trend: 'down' },
    ],
    sparklineData: [10, 11, 11.5, 12, 12.2, 12.5, 12.4],
  },
  {
    id: 'tax-vat',
    name: 'Tax/VAT',
    icon: 'FileText',
    status: 'healthy',
    kpis: [
      { label: 'ETR', value: '24.5%', change: 0.2, trend: 'up' },
      { label: 'VAT Payable', value: '$420K', change: -2.1, trend: 'down' },
    ],
    sparklineData: [450, 440, 435, 430, 425, 422, 420],
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet & Covenants',
    icon: 'Scale',
    status: 'healthy',
    kpis: [
      { label: 'Debt/EBITDA', value: '2.1x', change: -0.2, trend: 'down' },
      { label: 'Interest Coverage', value: '8.4x', change: 0.6, trend: 'up' },
    ],
    sparklineData: [7.5, 7.8, 8.0, 8.1, 8.3, 8.5, 8.4],
  },
  {
    id: 'concentration-risk',
    name: 'Concentration Risk',
    icon: 'Target',
    status: 'critical',
    kpis: [
      {
        label: 'Top 5 Customers',
        value: '58%',
        change: 4.2,
        trend: 'up',
        status: 'critical',
      },
      {
        label: 'Top Supplier',
        value: '32%',
        change: 2.1,
        trend: 'up',
        status: 'warning',
      },
    ],
    sparklineData: [40, 41, 43, 47, 52, 55, 58],
  },
];

export const mockHeadlines = [
  { label: 'Biggest MoM Change', value: 'EBITDA +12.3%', trend: 'up' as const },
  { label: 'Biggest YoY Change', value: 'Revenue +18.5%', trend: 'up' as const },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    severity: 'high',
    title: 'Concentration Risk Threshold Exceeded',
    description:
      'Top 5 customers now represent 58% of revenue, exceeding policy limit of 55%',
    section: 'concentration-risk',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: '2',
    severity: 'high',
    title: 'DSO Increased Above Target',
    description: 'DSO has risen to 42 days, 7 days above the 35-day target',
    section: 'ar',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
  },
  {
    id: '3',
    severity: 'high',
    title: 'FX Exposure Hedge Ratio Below Target',
    description: 'Hedged percentage dropped to 62%, below the 70% policy threshold',
    section: 'fx-treasury',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false,
  },
  {
    id: '4',
    severity: 'medium',
    title: 'Large Payment Due Next Week',
    description: 'Supplier payment of $2.4M due Nov 14, ensure sufficient liquidity',
    section: 'ap',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true,
  },
  {
    id: '5',
    severity: 'medium',
    title: 'Overdue Invoices Increased',
    description: '15 invoices totaling $680K are now >60 days overdue',
    section: 'ar',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isRead: true,
  },
  {
    id: '6',
    severity: 'low',
    title: 'Churn Rate Improved',
    description: 'Monthly churn decreased to 2.1%, down from 2.4% last month',
    section: 'revenue-health',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
  },
];

export const mockArWidgetResponse: ArWidgetApiResponse = {
  title: 'Accounts Receivable',
  source: 'api_ar',
  status: 'warning',
  status_reason: 'AR overdue ratio 0,77%',
  filters: {
    to: '2025-11-30',
    from: '2025-11-01',
    mode: 'month',
    compare: 'yoy',
    entity_id: null,
    report_ccy: 'EUR',
  },
  metrics: {
    dso: {
      better_is: 'down',
      delta_pct: null,
      value_days: 196.9013605442177,
    },
    open_ar: {
      value: 356850,
      currency: 'EUR',
      delta_pct: null,
    },
  },
};

export const mockApWidgetResponse: ApWidgetApiResponse = {
  title: 'Accounts Payable',
  source: 'api_ap',
  status: 'warning',
  status_reason: 'AP overdue ratio 70,29%',
  filters: {
    to: '2025-11-30',
    from: '2025-11-01',
    mode: 'month',
    compare: 'prev_period',
    entity_id: null,
    report_ccy: 'EUR',
  },
  metrics: {
    dpo: {
      better_is: 'up',
      delta_pct: 0.0546999787722487,
      value_days: 171.84152179390276,
    },
    open_ap: {
      value: 233575,
      currency: 'EUR',
      delta_pct: 0.158462492250465,
    },
  },
};

export const mockCashOutlookResponse: CashOutlookResponse = {
  as_of: '2025-11-11',
  title: '13-Week Outlook',
  currency: 'EUR',
  entity_id: 6,
  source: 'mock_cash_outlook',
  weeks: [
    { kind: 'projected', label: 'W1', value: 2300, week_end: '2025-11-16' },
    { kind: 'projected', label: 'W2', value: 2300, week_end: '2025-11-23' },
    { kind: 'projected', label: 'W3', value: 9350, week_end: '2025-11-30' },
    { kind: 'projected', label: 'W4', value: 9350, week_end: '2025-12-07' },
    { kind: 'projected', label: 'W5', value: 9350, week_end: '2025-12-14' },
    { kind: 'projected', label: 'W6', value: 9350, week_end: '2025-12-21' },
    { kind: 'projected', label: 'W7', value: 16475, week_end: '2025-12-28' },
    { kind: 'projected', label: 'W8', value: 16475, week_end: '2026-01-04' },
    { kind: 'projected', label: 'W9', value: 16475, week_end: '2026-01-11' },
    { kind: 'projected', label: 'W10', value: 16475, week_end: '2026-01-18' },
    { kind: 'projected', label: 'W11', value: 40175, week_end: '2026-01-25' },
    { kind: 'projected', label: 'W12', value: 40175, week_end: '2026-02-01' },
    { kind: 'projected', label: 'W13', value: 40175, week_end: '2026-02-08' },
  ],
  summary: [
    {
      min_balance_13w: 2300,
      will_breach_zero: false,
    },
  ],
};
