import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';

@Component({
  selector: 'app-overview-quick-links-card',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Quick Links</p>
          <h2 class="text-lg font-semibold">Deep Dives</h2>
        </div>
        <lucide-icon name="ChevronRight" class="h-5 w-5 text-primary" />
      </div>
      <ul class="mt-4 space-y-2 text-sm">
        <li
          class="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-muted"
          (click)="navigate.emit('ar')"
        >
          <span>Overdue invoices</span>
          <lucide-icon name="ArrowRight" class="h-4 w-4" />
        </li>
        <li
          class="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-muted"
          (click)="navigate.emit('fx-treasury')"
        >
          <span>FX exposure</span>
          <lucide-icon name="ArrowRight" class="h-4 w-4" />
        </li>
        <li
          class="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-muted"
          (click)="navigate.emit('concentration-risk')"
        >
          <span>Concentration limits</span>
          <lucide-icon name="ArrowRight" class="h-4 w-4" />
        </li>
      </ul>
    </div>
  `,
})
export class OverviewQuickLinksCardComponent {
  @Output() navigate = new EventEmitter<string>();
}
