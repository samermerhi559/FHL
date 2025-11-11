import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  protected readonly state = inject(DashboardStateService);
  protected readonly alerts = computed(() => this.state.alerts());

  protected markAsRead(alertId: string): void {
    this.state.markAlertAsRead(alertId);
  }
}
