import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IsActiveMatchOptions,
  Router,
  RouterModule,
} from '@angular/router';
import { mockPeriods } from '../../data/mock-data';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

@Component({
  selector: 'app-app-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideIconsModule],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
})
export class AppBarComponent {
  protected readonly periods = mockPeriods;
  protected readonly topNav = [
    { id: 'overview', label: 'Dashboard', path: '/overview' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'compare', label: 'Compare', path: '/compare' },
    { id: 'alerts', label: 'Alerts', path: '/alerts' },
  ];

  private readonly router = inject(Router);
  protected readonly state = inject(DashboardStateService);
  private readonly activeMatch: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      this.openSearch();
    }
  }

  protected openSearch(): void {
    this.state.setSearchOpen(true);
  }

  protected navigate(path: string): void {
    this.state.navigateTo(path);
  }

  protected toggleAi(): void {
    this.state.toggleAiInsights();
  }

  protected isActive(path: string): boolean {
    return this.router.isActive(path, this.activeMatch);
  }

  protected onTenantChange(value: string): void {
    const tenantId = Number(value);
    if (!Number.isNaN(tenantId)) {
      this.state.setTenant(tenantId);
      this.entityDropdownOpen = false;
    }
  }

  protected onPeriodChange(value: string): void {
    this.state.setPeriod(value);
  }

  protected get entitySummary(): string {
    return this.state.entitySummary();
  }

  protected entityDropdownOpen = false;

  protected toggleEntityDropdown(): void {
    if (!this.state.entityOptions().length) {
      return;
    }
    this.entityDropdownOpen = !this.entityDropdownOpen;
  }

  protected isEntitySelected(entityId: string): boolean {
    return (this.state.filters().entityIds ?? []).includes(entityId);
  }

  protected onAllEntitiesToggle(checked: boolean): void {
    if (checked) {
      this.state.setEntitySelections(['']);
    } else {
      this.state.setEntitySelections([]);
    }
  }

  protected onEntityToggle(entityId: string, checked: boolean): void {
    const current = new Set(this.state.filters().entityIds ?? []);
    if (checked) {
      current.add(entityId);
    } else {
      current.delete(entityId);
    }
    current.delete('');
    this.state.setEntitySelections([...current]);
  }
}
