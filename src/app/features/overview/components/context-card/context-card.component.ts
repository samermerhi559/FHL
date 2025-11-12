import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GlobalFilters } from '../../../../core/models/dashboard.models';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';

@Component({
  selector: 'app-overview-context-card',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Current Context</p>
          <h2 class="text-lg font-semibold">Executive Overview</h2>
        </div>
        <lucide-icon name="LayoutDashboard" class="h-5 w-5 text-primary" />
      </div>
      <dl class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between">
          <dt class="text-muted-foreground">Tenant</dt>
          <dd class="font-medium">
            {{ filters?.tenant?.name ?? 'Not Selected' }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted-foreground">Entities</dt>
          <dd class="font-medium">
            {{ entitySummary }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted-foreground">Period</dt>
          <dd class="font-medium">{{ filters?.period?.label }}</dd>
        </div>
      </dl>
     
    </div>
  `,
})
export class OverviewContextCardComponent {
  @Input() filters!: GlobalFilters | undefined;
  @Input() entitySummary = 'All Entities';
}
