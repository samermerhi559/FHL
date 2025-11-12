import { Injectable, computed, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { mockAlerts, mockPeriods, mockSections } from '../../data/mock-data';
import { TenantDirectoryService } from './tenant-directory.service';
import {
  Entity,
  GlobalFilters,
  Period,
  TenantDirectoryEntry,
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  readonly filters = signal<GlobalFilters>({
    period: mockPeriods[0],
    entityIds: [],
  });

  readonly tenantDirectory = signal<TenantDirectoryEntry[]>([]);
  readonly tenantLoading = signal(true);
  readonly aiEnabled = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly alerts = signal(mockAlerts);

  readonly unreadAlerts = computed(
    () => this.alerts().filter((alert) => !alert.isRead).length
  );

  readonly entityOptions = computed<Entity[]>(() => {
    const tenantId = this.filters().tenant?.id;
    if (!tenantId) {
      return [];
    }
    const tenant = this.tenantDirectory().find(
      (entry) => entry.tenant_id === tenantId
    );
    if (!tenant) {
      return [];
    }
    return tenant.entities.map((entry) => ({
      id: entry.entity_id.toString(),
      name: entry.name,
      type: 'subsidiary',
      directoryEntityId: entry.entity_id,
      tenantId: tenant.tenant_id,
      countryCode: entry.country_code,
      baseCurrency: entry.base_currency,
    }));
  });

  readonly selectedEntityIds = computed(() => this.filters().entityIds ?? []);

  readonly selectedEntities = computed<Entity[]>(() => {
    const ids = this.selectedEntityIds().filter((id) => Boolean(id));
    if (!ids.length) {
      return [];
    }
    const lookup = new Map(
      this.entityOptions().map((entity) => [entity.id, entity] as const)
    );
    return ids
      .map((id) => lookup.get(id))
      .filter((entity): entity is Entity => Boolean(entity));
  });

  readonly primaryEntity = computed<Entity | undefined>(
    () => this.selectedEntities().at(0) ?? undefined
  );

  readonly entitySummary = computed(() => {
    const options = this.entityOptions();
    if (!options.length) {
      return 'No entities';
    }
    const selection = this.filters().entityIds ?? [];
    if (!selection.length) {
      return 'Select entities';
    }
    if (selection.includes('')) {
      return 'All Entities';
    }
    const selectedEntities = this.selectedEntities();
    if (!selectedEntities.length) {
      return 'Select entities';
    }
    if (selectedEntities.length <= 2) {
      return selectedEntities.map((entity) => entity.name).join(', ');
    }
    return `${selectedEntities.length} entities`;
  });

  readonly searchResults = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return [];
    }
    return mockSections.filter((section) =>
      section.name.toLowerCase().includes(query)
    );
  });

  constructor(
    private readonly tenantService: TenantDirectoryService,
    private readonly router: Router
  ) {
    effect(
      () => {
        if (!this.tenantDirectory().length && this.tenantLoading()) {
          this.loadTenantDirectory();
        }
      },
      { allowSignalWrites: true }
    );
  }

  toggleAiInsights(): void {
    this.aiEnabled.update((value) => !value);
  }

  setAiInsights(enabled: boolean): void {
    this.aiEnabled.set(enabled);
  }

  setSearchOpen(open: boolean): void {
    this.searchOpen.set(open);
    if (!open) {
      this.searchQuery.set('');
    }
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  setPeriod(periodId: string): void {
    const period = mockPeriods.find((p) => p.id === periodId);
    if (!period) {
      return;
    }
    this.filters.update((current) => ({ ...current, period }));
  }

  setTenant(tenantId: number): void {
    const tenant = this.tenantDirectory().find(
      (entry) => entry.tenant_id === tenantId
    );
    if (!tenant) {
      return;
    }
    const entityOptions = tenant.entities.map((entry) => ({
      id: entry.entity_id.toString(),
      name: entry.name,
      type: 'subsidiary' as const,
      directoryEntityId: entry.entity_id,
      tenantId: tenant.tenant_id,
      countryCode: entry.country_code,
      baseCurrency: entry.base_currency,
    }));
    const defaultEntityId = entityOptions[0]?.id;

    this.filters.update((current) => ({
      ...current,
      tenant: {
        id: tenant.tenant_id,
        name: tenant.tenant_name,
      },
      entityIds: defaultEntityId ? [defaultEntityId] : [],
    }));
  }

  setEntitySelections(entityIds: string[]): void {
    const normalized = this.normalizeEntitySelection(entityIds);
    this.filters.update((current) => ({
      ...current,
      entityIds: normalized,
    }));
  }

  markAlertAsRead(alertId: string): void {
    this.alerts.update((current) =>
      current.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }

  navigateTo(path: string): void {
    void this.router.navigateByUrl(path);
  }

  private loadTenantDirectory(): void {
    this.tenantLoading.set(true);
    this.tenantService.fetchDirectory().subscribe({
      next: (directory) => {
        this.tenantDirectory.set(directory);
        if (directory.length > 0) {
          const [firstTenant] = directory;
          this.filters.update((current) => ({
            ...current,
            tenant: {
              id: firstTenant.tenant_id,
              name: firstTenant.tenant_name,
            },
          }));
          const firstEntity = firstTenant.entities.at(0);
          if (firstEntity) {
            this.filters.update((current) => ({
              ...current,
              entityIds: [firstEntity.entity_id.toString()],
            }));
          }
        }
      },
      error: (error) => {
        console.error('Failed to load tenant directory', error);
        this.tenantLoading.set(false);
      },
      complete: () => {
        this.tenantLoading.set(false);
      },
    });
  }

  private normalizeEntitySelection(entityIds: string[]): string[] {
    if (!entityIds.length) {
      return [];
    }
    const unique = Array.from(new Set(entityIds.filter((id) => id || id === '')));
    if (unique.includes('')) {
      return [''];
    }
    return unique;
  }
}
