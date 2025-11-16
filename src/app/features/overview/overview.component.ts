import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  mockCashOutlookResponse,
  mockHeadlinesResponse,
  mockBoardOverviewResponse,
  mockAlerts,
  mockSections,
} from '../../data/mock-data';
import {
  ApWidgetApiResponse,
  ArWidgetApiResponse,
  CashOutlookResponse,
  BoardOverviewConcentrationEntry,
  BoardOverviewConcentrationGroup,
  BoardOverviewResponse,
  BoardOverviewFxTreasury,
  BoardOverviewRevenueYoyPoint,
  HeadlinesResponse,
  Entity,
  GlobalFilters,
  HealthStatus,
  KPI,
  SectionConfig,
} from '../../core/models/dashboard.models';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { ArWidgetService } from '../../core/services/ar-widget.service';
import { ApWidgetService } from '../../core/services/ap-widget.service';
import { CashOutlookService } from '../../core/services/cash-outlook.service';
import { HeadlinesService } from '../../core/services/headlines.service';
import { BoardOverviewService } from '../../core/services/board-overview.service';
import { resolveWidgetWindow } from '../../core/utils/periods';
import {
  formatCurrencyCompact,
  formatDays,
  toDeltaPercent,
} from '../../core/utils/formatters';
import { OverviewContextCardComponent } from './components/context-card/context-card.component';
import { OverviewHeadlinesCardComponent } from './components/headlines-card/headlines-card.component';
import { OverviewAlertsCardComponent } from './components/alerts-card/alerts-card.component';
import { OverviewCollectionWidgetComponent } from './components/collection-widget/collection-widget.component';
import { OverviewDisbursementWidgetComponent } from './components/disbursement-widget/disbursement-widget.component';
import { OverviewProjectionCardComponent } from './components/projection-card/projection-card.component';
import { OverviewProjectionGraphComponent } from './components/projection-graph/projection-graph.component';
import { OverviewAiCardComponent } from './components/ai-card/ai-card.component';
import { OverviewQuickLinksCardComponent } from './components/quick-links-card/quick-links-card.component';
import { OverviewSectionWidgetComponent } from './components/section-widget/section-widget.component';

interface WidgetState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OverviewContextCardComponent,
    OverviewHeadlinesCardComponent,
    OverviewAlertsCardComponent,
    OverviewCollectionWidgetComponent,
    OverviewDisbursementWidgetComponent,
    OverviewProjectionCardComponent,
    OverviewProjectionGraphComponent,
    OverviewAiCardComponent,
    OverviewQuickLinksCardComponent,
    OverviewSectionWidgetComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected readonly state = inject(DashboardStateService);
  private readonly arService = inject(ArWidgetService);
  private readonly apService = inject(ApWidgetService);
  private readonly cashService = inject(CashOutlookService);
  private readonly headlinesService = inject(HeadlinesService);
  private readonly boardOverviewService = inject(BoardOverviewService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly boardOverviewState =
    signal<WidgetState<BoardOverviewResponse>>({
      loading: false,
      error: null,
      data: mockBoardOverviewResponse,
    });
  protected readonly sections = signal<SectionConfig[]>(
    buildBoardSections(mockSections, mockBoardOverviewResponse)
  );
  protected readonly headlinesState = signal<WidgetState<HeadlinesResponse>>({
    loading: false,
    error: null,
    data: mockHeadlinesResponse,
  });
  protected readonly alerts = mockAlerts;
  protected readonly alertsPreview = this.alerts.slice(0, 3);
  protected readonly statusClasses: Record<HealthStatus, string> = {
    healthy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    critical: 'border-red-200 bg-red-50 text-red-700',
  };

  protected readonly arState = signal<WidgetState<ArWidgetApiResponse>>({
    loading: false,
    error: null,
    data: null,
  });

  protected readonly apState = signal<WidgetState<ApWidgetApiResponse>>({
    loading: false,
    error: null,
    data: null,
  });
  protected readonly cashState = signal<WidgetState<CashOutlookResponse>>({
    loading: false,
    error: null,
    data: mockCashOutlookResponse,
  });
  protected readonly cashExpanded = signal(false);

  protected readonly computedSections = signal<SectionConfig[]>(mockSections);
  protected readonly arSection = computed(() =>
    this.computedSections().find((section) => section.id === 'ar')
  );
  protected readonly apSection = computed(() =>
    this.computedSections().find((section) => section.id === 'ap')
  );
  protected readonly sectionLookup = computed(() => {
    const lookup: Record<string, SectionConfig | undefined> = {};
    for (const section of this.computedSections()) {
      lookup[section.id] = section;
    }
    return lookup;
  });
  protected readonly cashWeeks = computed(
    () => this.cashState().data?.weeks ?? mockCashOutlookResponse.weeks
  );
  protected readonly cashSummary = computed(
    () => this.cashState().data?.summary ?? []
  );
  protected readonly cashTitle = computed(
    () => this.cashState().data?.title ?? '13-Week Outlook'
  );
  protected readonly cashAsOf = computed(
    () => this.cashState().data?.as_of ?? ''
  );
  protected readonly cashCurrency = computed(
    () =>
      this.cashState().data?.currency ??
      this.state.primaryEntity()?.baseCurrency ??
      'USD'
  );

  private readonly widgetEffect = effect(
    () => {
      const filters = this.state.filters();
      this.loadWidgets(filters);
      this.loadHeadlines(filters);
      this.loadBoardOverview(filters);
    },
    { allowSignalWrites: true }
  );

  private readonly sectionsEffect = effect(
    () => {
      this.computedSections.set(
        this.sections().map((section) => {
          if (section.id === 'ar') {
            return buildArSection(section, this.arState());
          }
          if (section.id === 'ap') {
            return buildApSection(section, this.apState());
          }
          return section;
        })
      );
    },
    { allowSignalWrites: true }
  );

  protected navigateToSection(sectionId: string): void {
    const path =
      sectionId === 'overview' ? '/overview' : `/sections/${sectionId}`;
    this.state.navigateTo(path);
  }

  protected get arStatusLabel(): string {
    return resolveWidgetStatusLabel(this.arState());
  }

  protected get apStatusLabel(): string {
    return resolveWidgetStatusLabel(this.apState());
  }

  protected toggleCashExpanded(): void {
    this.cashExpanded.update((value) => !value);
  }

  private loadWidgets(filters: GlobalFilters): void {
    const primaryEntity = this.state.primaryEntity();
    const payload = buildWidgetPayload(filters, primaryEntity);
    if (!payload) {
      this.arState.set({ loading: false, error: null, data: null });
      this.apState.set({ loading: false, error: null, data: null });
      this.cashState.set({
        loading: false,
        error: null,
        data: mockCashOutlookResponse,
      });
      return;
    }

    this.arState.update((current) => ({ ...current, loading: true, error: null }));
    this.apState.update((current) => ({ ...current, loading: true, error: null }));
    this.loadCashOutlook(filters, primaryEntity);

    this.arService
      .fetchWidget(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.arState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.arState.set({
            loading: false,
            error: error.message ?? 'Unable to load Accounts Receivable widget',
            data: null,
          }),
      });

    this.apService
      .fetchWidget(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.apState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.apState.set({
            loading: false,
            error: error.message ?? 'Unable to load Accounts Payable widget',
            data: null,
          }),
      });
  }

  private loadCashOutlook(
    filters: GlobalFilters,
    primaryEntity?: Entity
  ): void {
    if (!filters.tenant?.id) {
      this.cashState.set({
        loading: false,
        error: null,
        data: mockCashOutlookResponse,
      });
      return;
    }

    const entityIds = buildEntityIdsCsv(filters);
    const reportCcy = primaryEntity?.baseCurrency ?? null;

    this.cashState.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    this.cashService
      .fetchCashOutlook(entityIds, reportCcy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.cashState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.cashState.set({
            loading: false,
            error: error.message ?? 'Unable to load cash outlook',
            data: untracked(() => this.cashState().data),
          }),
      });
  }

  private loadHeadlines(filters: GlobalFilters): void {
    if (!filters.tenant?.id) {
      this.headlinesState.set({
        loading: false,
        error: null,
        data: mockHeadlinesResponse,
      });
      return;
    }

    const entityIds = buildEntityIdsCsv(filters);

    this.headlinesState.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    this.headlinesService
      .fetchHeadlines(entityIds)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) =>
          this.headlinesState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.headlinesState.set({
            loading: false,
            error: error.message ?? 'Unable to load headlines',
            data: untracked(() => this.headlinesState().data),
          }),
      });
  }

  private loadBoardOverview(filters: GlobalFilters): void {
    if (!filters.tenant?.id) {
      this.boardOverviewState.set({
        loading: false,
        error: null,
        data: mockBoardOverviewResponse,
      });
      this.sections.set(
        buildBoardSections(mockSections, mockBoardOverviewResponse)
      );
      return;
    }

    const entityIds = buildEntityIdsCsv(filters);
    const periodWindow = resolveWidgetWindow(filters.period);
    const asOf =
      periodWindow.to ?? new Date().toISOString().slice(0, 10);
    const reportCcy = this.state.primaryEntity()?.baseCurrency ?? null;
    const previousData = untracked(() => this.boardOverviewState().data);

    this.boardOverviewState.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    this.boardOverviewService
      .fetchBoardOverview(entityIds, asOf, reportCcy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.boardOverviewState.set({
            loading: false,
            error: null,
            data,
          });
          this.sections.set(buildBoardSections(mockSections, data));
        },
        error: (error) => {
          const fallbackData = previousData ?? mockBoardOverviewResponse;
          this.boardOverviewState.set({
            loading: false,
            error: error.message ?? 'Unable to load board overview',
            data: fallbackData,
          });
          this.sections.set(buildBoardSections(mockSections, fallbackData));
        },
      });
  }
}

const statusMap: Record<string, HealthStatus> = {
  ok: 'healthy',
  warning: 'warning',
  critical: 'critical',
};

const boardStatusMap: Record<string, HealthStatus> = {
  healthy: 'healthy',
  warning: 'warning',
  critical: 'critical',
};

const buildWidgetPayload = (
  filters: GlobalFilters,
  primaryEntity?: Entity
) => {
  if (!filters.tenant?.id) {
    return null;
  }

  const periodWindow = resolveWidgetWindow(filters.period);
  const entityIds = buildEntityIdsCsv(filters);
  return {
    entityIds,
    mode: periodWindow.mode,
    compare: periodWindow.compare,
    from: periodWindow.from ?? null,
    to: periodWindow.to ?? null,
    reportCcy: primaryEntity?.baseCurrency ?? null,
  };
};

const buildEntityIdsCsv = (filters: GlobalFilters): string => {
  if (!filters.entityIds?.length) {
    return '';
  }
  if (filters.entityIds.includes('')) {
    return '';
  }
  return filters.entityIds.join(',');
};

const buildArSection = (
  base: SectionConfig,
  state: WidgetState<ArWidgetApiResponse>
): SectionConfig => {
  if (!state.data) {
    return buildPlaceholderSection(base, state);
  }

  const { status, status_reason, metrics, source, filters } = state.data;
  const [dsoBase = { label: 'DSO', value: '--' }, openArBase = { label: 'Open AR', value: '--' }] =
    base.kpis;

  return {
    ...base,
    status: statusMap[status] ?? base.status,
    statusReason: status_reason,
    source: source ?? base.source,
    kpis: [
      {
        ...dsoBase,
        value: formatDays(metrics.dso.value_days),
        change: toDeltaPercent(metrics.dso.delta_pct),
        trend: resolveTrend(metrics.dso.delta_pct),
      },
      {
        ...openArBase,
        value: formatCurrencyCompact(
          metrics.open_ar.value,
          metrics.open_ar.currency || filters.report_ccy || 'USD'
        ),
        change: toDeltaPercent(metrics.open_ar.delta_pct),
        trend: resolveTrend(metrics.open_ar.delta_pct),
      },
    ],
  };
};

const buildApSection = (
  base: SectionConfig,
  state: WidgetState<ApWidgetApiResponse>
): SectionConfig => {
  if (!state.data) {
    return buildPlaceholderSection(base, state);
  }

  const { status, status_reason, metrics, source, filters } = state.data;
  const [dpoBase = { label: 'DPO', value: '--' }, openApBase = { label: 'Open AP', value: '--' }] =
    base.kpis;

  return {
    ...base,
    status: statusMap[status] ?? base.status,
    statusReason: status_reason,
    source: source ?? base.source,
    kpis: [
      {
        ...dpoBase,
        value: formatDays(metrics.dpo.value_days),
        change: toDeltaPercent(metrics.dpo.delta_pct),
        trend: resolveTrend(metrics.dpo.delta_pct),
      },
      {
        ...openApBase,
        value: formatCurrencyCompact(
          metrics.open_ap.value,
          metrics.open_ap.currency || filters.report_ccy || 'USD'
        ),
        change: toDeltaPercent(metrics.open_ap.delta_pct),
        trend: resolveTrend(metrics.open_ap.delta_pct),
      },
    ],
  };
};

const buildBoardSections = (
  base: SectionConfig[],
  board?: BoardOverviewResponse | null
): SectionConfig[] => {
  return base.map((section) => {
    const clone = cloneSection(section);
    if (!board) {
      return clone;
    }
    switch (clone.id) {
      case 'liquidity':
        return mapLiquiditySection(clone, board);
      case 'profitability':
        return mapProfitabilitySection(clone, board);
      case 'working-capital':
        return mapWorkingCapitalSection(clone, board);
      case 'revenue-health':
        return mapRevenueSection(clone, board);
      case 'fx-treasury':
        return mapFxTreasurySection(clone, board);
      case 'tax-vat':
        return mapTaxSection(clone, board);
      case 'balance-sheet':
        return mapBalanceSheetSection(clone, board);
      case 'concentration-risk':
        return mapConcentrationSection(clone, board);
      default:
        return clone;
    }
  });
};

const cloneSection = (section: SectionConfig): SectionConfig => ({
  ...section,
  kpis: section.kpis.map((kpi) => ({ ...kpi })),
  sparklineData: section.sparklineData ? [...section.sparklineData] : undefined,
});

const resolveBoardStatus = (
  status?: string | null
): HealthStatus | undefined => {
  if (!status) {
    return undefined;
  }
  const normalized = status.trim().toLowerCase();
  return boardStatusMap[normalized];
};

const mapLiquiditySection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.liquidity) {
    return section;
  }
  const currency = resolveCurrency(board.filters?.report_ccy);
  const [cashKpi, ratioKpi] = section.kpis;
  return {
    ...section,
    status: resolveBoardStatus(board.liquidity.status) ?? section.status,
    kpis: [
      updateKpiValue(
        cashKpi,
        formatCurrencyCompact(board.liquidity.cash, currency)
      ),
      updateKpiValue(ratioKpi, formatRatioValue(board.liquidity.quick_ratio)),
    ],
  };
};

const mapProfitabilitySection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.profitability) {
    return section;
  }
  const currency = resolveCurrency(
    board.revenue?.run_rate?.currency,
    board.filters?.report_ccy
  );
  const [marginKpi, ebitdaKpi] = section.kpis;
  return {
    ...section,
    status: resolveBoardStatus(board.profitability.status) ?? section.status,
    kpis: [
      updateKpiValue(
        marginKpi,
        formatPercentValue(board.profitability.gross_margin_pct, {
          fromFraction: true,
        })
      ),
      updateKpiValue(
        ebitdaKpi,
        formatCurrencyCompact(board.profitability.ebitda_ttm, currency)
      ),
    ],
  };
};

const mapWorkingCapitalSection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.working_capital) {
    return section;
  }
  const currency = resolveCurrency(board.filters?.report_ccy);
  const [daysKpi, amountKpi] = section.kpis;
  const wcAmount =
    board.working_capital.amount ??
    (board.working_capital.ar_open !== null &&
    board.working_capital.ar_open !== undefined &&
    board.working_capital.ap_open !== null &&
    board.working_capital.ap_open !== undefined
      ? (board.working_capital.ar_open ?? 0) -
        (board.working_capital.ap_open ?? 0)
      : board.working_capital.rev_ttm);
  return {
    ...section,
    status: resolveBoardStatus(board.working_capital.status) ?? section.status,
    kpis: [
      updateKpiValue(
        daysKpi,
        formatDays(
          board.working_capital.ccc_days ?? board.working_capital.dso_days
        )
      ),
      updateKpiValue(
        amountKpi,
        formatCurrencyCompact(wcAmount ?? null, currency)
      ),
    ],
  };
};

const mapRevenueSection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.revenue) {
    return section;
  }
  const currency = resolveCurrency(
    board.revenue.run_rate?.currency,
    board.filters?.report_ccy
  );
  const [runRateKpi, yoyKpi] = section.kpis;
  const sparklineData = (board.revenue.yoy?.series ?? []).map(
    (point) => point.yoy_pct ?? 0
  );
  return {
    ...section,
    status: resolveBoardStatus(board.revenue.status) ?? section.status,
    kpis: [
      updateKpiValue(
        runRateKpi,
        formatCurrencyCompact(board.revenue.run_rate?.latest_month, currency)
      ),
      updateKpiValue(
        yoyKpi,
        formatPercentValue(latestYoyPercent(board.revenue.yoy?.series))
      ),
    ],
    sparklineData: sparklineData.length ? sparklineData : section.sparklineData,
  };
};

const mapFxTreasurySection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.fx_treasury) {
    return section;
  }
  const currency = resolveCurrency(
    board.fx_treasury.filters?.report_ccy,
    board.filters?.report_ccy
  );
  const [exposureKpi, hedgeKpi] = section.kpis;
  return {
    ...section,
    status: resolveBoardStatus(board.fx_treasury.status) ?? section.status,
    kpis: [
      updateKpiValue(
        exposureKpi,
        formatCurrencyCompact(board.fx_treasury.total_net, currency)
      ),
      updateKpiValue(hedgeKpi, formatTopCurrencyShare(board.fx_treasury)),
    ],
  };
};

const mapTaxSection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.tax_vat) {
    return section;
  }
  const currency = resolveCurrency(
    board.tax_vat.filters?.report_ccy,
    board.filters?.report_ccy
  );
  const [netKpi, filingKpi] = section.kpis;
  const latest = board.tax_vat.latest;
  const hasData =
    !!latest &&
    (latest.net !== null ||
      latest.input !== null ||
      latest.output !== null ||
      !!latest.month);
  const resolvedStatus = resolveBoardStatus(board.tax_vat.status);
  return {
    ...section,
    status: hasData && resolvedStatus ? resolvedStatus : section.status,
    hideStatus: hasData ? section.hideStatus ?? false : true,
    kpis: [
      updateKpiValue(
        netKpi,
        formatCurrencyCompact(board.tax_vat.latest?.net, currency)
      ),
      updateKpiValue(
        filingKpi,
        formatMonthLabel(board.tax_vat.latest?.month)
      ),
    ],
  };
};

const mapBalanceSheetSection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.balance_sheet_covenants) {
    return section;
  }
  const [debtKpi, coverageKpi] = section.kpis;
  return {
    ...section,
    status:
      resolveBoardStatus(board.balance_sheet_covenants.status) ??
      section.status,
    kpis: [
      updateKpiValue(
        debtKpi,
        formatRatioValue(board.balance_sheet_covenants.debt_to_ebitda)
      ),
      updateKpiValue(
        coverageKpi,
        formatRatioValue(board.balance_sheet_covenants.interest_coverage)
      ),
    ],
  };
};

const mapConcentrationSection = (
  section: SectionConfig,
  board: BoardOverviewResponse
): SectionConfig => {
  if (!board.concentration) {
    return section;
  }
  const [customersKpi, supplierKpi] = section.kpis;
  const customerTopEntries = board.concentration.customers?.top ?? [];
  const customerCount = resolveTopCount(
    board.concentration.customers?.filters?.top_n,
    customerTopEntries.length
  );
  const customerShare = resolveConcentrationShare(
    board.concentration.customers,
    customerCount,
    customerTopEntries
  );
  const supplierTopEntries = board.concentration.suppliers?.top ?? [];
  const supplierCount = resolveTopCount(
    board.concentration.suppliers?.filters?.top_n,
    supplierTopEntries.length
  );
  const supplierShare = resolveConcentrationShare(
    board.concentration.suppliers,
    supplierCount,
    supplierTopEntries
  );

  const formattedCustomersKpi = {
    ...updateKpiValue(
      customersKpi,
      formatPercentValue(customerShare.value, {
        fromFraction: customerShare.fromFraction,
      })
    ),
    label: formatTopCountLabel(
      customersKpi?.label,
      customerCount,
      'Customers',
      'Customer'
    ),
  };
  const formattedSuppliersKpi = {
    ...updateKpiValue(
      supplierKpi,
      formatPercentValue(supplierShare.value, {
        fromFraction: supplierShare.fromFraction,
      })
    ),
    label: formatTopCountLabel(
      supplierKpi?.label,
      supplierCount,
      'Suppliers',
      'Supplier'
    ),
  };
  return {
    ...section,
    status: resolveBoardStatus(board.concentration.status) ?? section.status,
    kpis: [
      formattedCustomersKpi,
      formattedSuppliersKpi,
    ],
  };
};

const updateKpiValue = (kpi: KPI | undefined, value: string): KPI => {
  if (!kpi) {
    return {
      label: '',
      value,
    };
  }
  return {
    ...kpi,
    value,
    change: undefined,
    trend: undefined,
  };
};

const latestYoyPercent = (
  series?: BoardOverviewRevenueYoyPoint[]
): number | null => {
  if (!series?.length) {
    return null;
  }
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const value = series[index]?.yoy_pct;
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  return null;
};

const formatTopCurrencyShare = (fx: BoardOverviewFxTreasury): string => {
  if (!fx.by_ccy?.length) {
    return '--';
  }
  const top = [...fx.by_ccy].sort(
    (a, b) => Math.abs(b.net) - Math.abs(a.net)
  )[0];
  if (!top) {
    return '--';
  }
  if (!fx.total_net) {
    return `${top.ccy} · ${formatCurrencyCompact(top.net, top.ccy)}`;
  }
  const share = Math.abs(top.net) / Math.abs(fx.total_net || 1);
  return `${top.ccy} · ${formatPercentValue(share, { fromFraction: true })}`;
};

const formatPercentValue = (
  value?: number | null,
  options: { fromFraction?: boolean } = {}
): string => {
  if (value === null || value === undefined) {
    return '--';
  }
  const percent = options.fromFraction ? value * 100 : value;
  const decimals = determinePercentDecimals(percent);
  return `${percent.toFixed(decimals)}%`;
};

const formatRatioValue = (
  value?: number | null,
  suffix = 'x'
): string => {
  if (value === null || value === undefined) {
    return '--';
  }
  const decimals = Math.abs(value) < 10 ? 1 : 0;
  return `${value.toFixed(decimals)}${suffix}`;
};

const formatMonthLabel = (value?: string | null): string => {
  if (!value) {
    return '--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

const resolveCurrency = (
  ...candidates: Array<string | null | undefined>
): string => {
  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }
  return 'USD';
};

const clampShare = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
};

const determinePercentDecimals = (value: number): number => {
  if (Number.isInteger(value)) {
    return 0;
  }
  if (Math.abs(value) < 10) {
    return 1;
  }
  return 0;
};

interface ConcentrationShareResult {
  value: number | null;
  fromFraction: boolean;
}

const resolveConcentrationShare = (
  group: BoardOverviewConcentrationGroup | undefined,
  count: number,
  fallbackEntries: BoardOverviewConcentrationEntry[]
): ConcentrationShareResult => {
  if (!group) {
    return { value: null, fromFraction: false };
  }
  const normalizedCount = Math.max(1, Math.floor(count) || 1);
  const metrics =
    group as unknown as Record<string, number | null | undefined>;
  const candidateKeys = [
    `share_top${normalizedCount}_pct`,
    `top${normalizedCount}_share_pct`,
    'share_top_pct',
    'top_share_pct',
    'share_top1_pct',
    'top1_share_pct',
  ];
  for (const key of candidateKeys) {
    const directValue = metrics[key];
    if (directValue !== null && directValue !== undefined) {
      return { value: directValue, fromFraction: false };
    }
  }
  const entries = fallbackEntries?.length
    ? fallbackEntries
    : group.top ?? [];
  if (!entries.length) {
    return { value: null, fromFraction: true };
  }
  const computedShare = clampShare(
    entries
      .slice(0, normalizedCount)
      .reduce((sum, entry) => sum + (entry.share_pct ?? 0), 0)
  );
  return { value: computedShare, fromFraction: true };
};

const formatTopCountLabel = (
  fallbackLabel: string | undefined,
  count: number,
  plural: string,
  singular: string
): string => {
  if (count <= 1) {
    return fallbackLabel ?? `Top ${singular}`;
  }
  return `Top ${count} ${plural}`;
};

const resolveTopCount = (
  requested?: number | null,
  fallbackLength = 0
): number => {
  if (requested && requested > 0) {
    return requested;
  }
  if (fallbackLength > 0) {
    return fallbackLength;
  }
  return 1;
};

const buildPlaceholderSection = <T>(
  base: SectionConfig,
  state: WidgetState<T>
): SectionConfig => ({
  ...base,
  status: state.error ? 'critical' : base.status,
  statusReason: state.error ?? base.statusReason,
  kpis: base.kpis.map((kpi) => ({
    ...kpi,
    value: state.loading ? 'Loading...' : '--',
    change: undefined,
    trend: undefined,
  })),
});

const resolveWidgetStatusLabel = (state: WidgetState<unknown>): string => {
  if (state.loading) {
    return 'Loading...';
  }
  if (state.error) {
    return 'Error';
  }
  return 'Synced';
};

const resolveTrend = (delta?: number | null): 'up' | 'down' | undefined => {
  if (delta === null || delta === undefined) {
    return undefined;
  }
  return delta >= 0 ? 'up' : 'down';
};
