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

    this.filters.update((current) => ({
      ...current,
      tenant: {
        id: tenant.tenant_id,
        name: tenant.tenant_name,
      },
      entity: entityOptions[0] ?? current.entity,
    }));
  }

  setEntity(entityId: string): void {
    const entity = this.entityOptions().find((item) => item.id === entityId);
    if (!entity) {
      return;
    }
    this.filters.update((current) => ({ ...current, entity }));
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
              entity: {
                id: firstEntity.entity_id.toString(),
                name: firstEntity.name,
                type: 'subsidiary',
                directoryEntityId: firstEntity.entity_id,
                tenantId: firstTenant.tenant_id,
                countryCode: firstEntity.country_code,
                baseCurrency: firstEntity.base_currency,
              },
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
}
