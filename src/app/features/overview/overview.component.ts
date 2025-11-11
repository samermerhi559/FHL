import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  mockCashOutlookResponse,
  mockHeadlinesResponse,
  mockAlerts,
  mockSections,
} from '../../data/mock-data';
import {
  ApWidgetApiResponse,
  ArWidgetApiResponse,
  CashOutlookResponse,
  HeadlinesResponse,
  GlobalFilters,
  HealthStatus,
  SectionConfig,
} from '../../core/models/dashboard.models';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { ArWidgetService } from '../../core/services/ar-widget.service';
import { ApWidgetService } from '../../core/services/ap-widget.service';
import { CashOutlookService } from '../../core/services/cash-outlook.service';
import { HeadlinesService } from '../../core/services/headlines.service';
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sections = signal(mockSections);
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
      this.state.filters().entity?.baseCurrency ??
      'USD'
  );

  private readonly widgetEffect = effect(
    () => {
      const filters = this.state.filters();
      this.loadWidgets(filters);
      this.loadHeadlines(filters);
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
    const payload = buildWidgetPayload(filters);
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
    this.loadCashOutlook(filters);

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

  private loadCashOutlook(filters: GlobalFilters): void {
    const tenant =
      filters.tenant?.id?.toString() ?? filters.tenant?.name ?? null;
    const entityId = getEntityId(filters);
    if (!tenant || entityId === null) {
      this.cashState.set({
        loading: false,
        error: null,
        data: mockCashOutlookResponse,
      });
      return;
    }

    this.cashState.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    this.cashService
      .fetchCashOutlook(tenant, entityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.cashState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.cashState.set({
            loading: false,
            error: error.message ?? 'Unable to load cash outlook',
            data: this.cashState().data,
          }),
      });
  }

  private loadHeadlines(filters: GlobalFilters): void {
    const tenant =
      filters.tenant?.id?.toString() ?? filters.tenant?.name ?? null;
    const entityId = getEntityId(filters);
    if (!tenant || entityId === null) {
      this.headlinesState.set({
        loading: false,
        error: null,
        data: mockHeadlinesResponse,
      });
      return;
    }

    this.headlinesState.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    this.headlinesService
      .fetchHeadlines(tenant, entityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) =>
          this.headlinesState.set({ loading: false, error: null, data }),
        error: (error) =>
          this.headlinesState.set({
            loading: false,
            error: error.message ?? 'Unable to load headlines',
            data: this.headlinesState().data,
          }),
      });
  }
}

const statusMap: Record<string, HealthStatus> = {
  ok: 'healthy',
  warning: 'warning',
  critical: 'critical',
};

const buildWidgetPayload = (filters: GlobalFilters) => {
  if (!filters.tenant) {
    return null;
  }

  const periodWindow = resolveWidgetWindow(filters.period);
  return {
    tenant: filters.tenant.name,
    entityId: getEntityId(filters),
    mode: periodWindow.mode,
    compare: periodWindow.compare,
    from: periodWindow.from ?? null,
    to: periodWindow.to ?? null,
    reportCcy: filters.entity?.baseCurrency ?? null,
  };
};

const getEntityId = (filters: GlobalFilters): number | null => {
  if (!filters.entity) {
    return null;
  }
  if (filters.entity.directoryEntityId) {
    return filters.entity.directoryEntityId;
  }
  const parsed = Number(filters.entity.id);
  return Number.isFinite(parsed) ? parsed : null;
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
