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
    }
  }

  protected onEntityChange(value: string): void {
    this.state.setEntity(value);
  }

  protected onPeriodChange(value: string): void {
    this.state.setPeriod(value);
  }
}
