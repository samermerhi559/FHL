import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppBarComponent } from './layout/app-bar/app-bar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightDrawerComponent } from './layout/right-drawer/right-drawer.component';
import { DashboardStateService } from './core/services/dashboard-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppBarComponent, SidebarComponent, RightDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly state = inject(DashboardStateService);
  private readonly router = inject(Router);
  protected readonly activeSection = signal('overview');
  protected readonly drawerContext = computed(() => {
    const filters = this.state.filters();
    const entityLabel = this.state.entitySummary();
    return [filters.tenant?.name, entityLabel, filters.period.label]
      .filter(Boolean)
      .join(' | ');
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.activeSection.set(this.resolveSectionFromUrl(this.router.url));
      });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state.searchOpen()) {
      this.state.setSearchOpen(false);
    } else if (this.state.aiEnabled()) {
      this.state.setAiInsights(false);
    }
  }

  protected handleSearchNavigate(sectionId: string): void {
    const path =
      sectionId === 'overview'
        ? '/overview'
        : sectionId.startsWith('/')
          ? sectionId
          : `/sections/${sectionId}`;
    this.state.navigateTo(path);
    this.state.setSearchOpen(false);
  }

  private resolveSectionFromUrl(url: string): string {
    if (url.startsWith('/sections/')) {
      return url.split('/')[2] ?? 'overview';
    }
    if (url.startsWith('/alerts')) return 'alerts';
    if (url.startsWith('/compare')) return 'compare';
    if (url.startsWith('/reports')) return 'reports';
    if (url.startsWith('/ops')) return 'ops';
    return 'overview';
  }
}

