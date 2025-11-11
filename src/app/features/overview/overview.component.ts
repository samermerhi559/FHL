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
  mock13WeekCashData,
  mockAlerts,
  mockHeadlines,
  mockSections,
} from '../../data/mock-data';
import {
  ApWidgetApiResponse,
  ArWidgetApiResponse,
  GlobalFilters,
  HealthStatus,
  SectionConfig,
} from '../../core/models/dashboard.models';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { ArWidgetService } from '../../core/services/ar-widget.service';
import { ApWidgetService } from '../../core/services/ap-widget.service';
import { resolveWidgetWindow } from '../../core/utils/periods';
import {
  formatCurrencyCompact,
  formatDays,
  toDeltaPercent,
} from '../../core/utils/formatters';
import { SparklineComponent } from '../../shared/components/sparkline/sparkline.component';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

interface WidgetState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule, SparklineComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected readonly state = inject(DashboardStateService);
  private readonly arService = inject(ArWidgetService);
  private readonly apService = inject(ApWidgetService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sections = signal(mockSections);
  protected readonly headlines = mockHeadlines;
  protected readonly alerts = mockAlerts;
  protected readonly cashTrend = mock13WeekCashData;
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

  protected readonly computedSections = signal<SectionConfig[]>(mockSections);
  protected readonly arSection = computed(() =>
    this.computedSections().find((section) => section.id === 'ar')
  );
  protected readonly apSection = computed(() =>
    this.computedSections().find((section) => section.id === 'ap')
  );

  private readonly widgetEffect = effect(
    () => {
      const filters = this.state.filters();
      this.loadWidgets(filters);
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

  private loadWidgets(filters: GlobalFilters): void {
    const payload = buildWidgetPayload(filters);
    if (!payload) {
      this.arState.set({ loading: false, error: null, data: null });
      this.apState.set({ loading: false, error: null, data: null });
      return;
    }

    this.arState.update((current) => ({ ...current, loading: true, error: null }));
    this.apState.update((current) => ({ ...current, loading: true, error: null }));

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

const resolveTrend = (delta?: number | null): 'up' | 'down' | undefined => {
  if (delta === null || delta === undefined) {
    return undefined;
  }
  return delta >= 0 ? 'up' : 'down';
};
