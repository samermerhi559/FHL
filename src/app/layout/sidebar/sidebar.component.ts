import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  IsActiveMatchOptions,
  Router,
  RouterModule,
} from '@angular/router';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected collapsed = signal(false);
  protected readonly items: NavItem[] = [
    { id: 'overview', label: 'Home', icon: 'Home', path: '/overview' },
    { id: 'liquidity', label: 'Liquidity', icon: 'Droplets', path: '/sections/liquidity' },
    { id: 'ar', label: 'Incomes', icon: 'ArrowDownToLine', path: '/sections/ar' },
    { id: 'ap', label: 'Expenses', icon: 'ArrowUpToLine', path: '/sections/ap' },
    { id: 'profitability', label: 'Profitability', icon: 'TrendingUp', path: '/sections/profitability' },
    { id: 'working-capital', label: 'Treasury', icon: 'Repeat', path: '/sections/working-capital' },
    { id: 'revenue-health', label: 'Revenue', icon: 'DollarSign', path: '/sections/revenue-health' },
    { id: 'fx-treasury', label: 'FX & Treasury', icon: 'Coins', path: '/sections/fx-treasury' },
    { id: 'tax-vat', label: 'Files', icon: 'FileText', path: '/sections/tax-vat' },
    { id: 'balance-sheet', label: 'Accounting', icon: 'Scale', path: '/sections/balance-sheet' },
    { id: 'concentration-risk', label: 'Master Data', icon: 'Target', path: '/sections/concentration-risk' },
  ];

  protected readonly adminItem: NavItem = {
    id: 'ops-admin',
    label: 'Ops / Admin',
    icon: 'Settings',
    path: '/ops',
  };

  private readonly router = inject(Router);
  protected readonly state = inject(DashboardStateService);
  private readonly activeMatch: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };

  protected toggle(): void {
    this.collapsed.update((value) => !value);
  }

  protected navigate(path: string): void {
    this.state.navigateTo(path);
  }

  protected isActive(path: string): boolean {
    return this.router.isActive(path, this.activeMatch);
  }
}
