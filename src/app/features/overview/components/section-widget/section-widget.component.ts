import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionConfig } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-section-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (section) {
      <article
        class="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-primary"
        (click)="navigate.emit(section.id)"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-muted-foreground">{{ section.name }}</p>
            <h3 class="text-xl font-semibold">
              {{ section.kpis.length ? section.kpis[0].value : '--' }}
            </h3>
          </div>
          @if (!section.hideStatus) {
            <span
              class="rounded-full border px-3 py-1 text-xs font-medium"
              [ngClass]="statusClasses[section.status]"
            >
              {{ section.status | titlecase }}
            </span>
          }
        </div>

        <div class="mt-4 grid gap-3 text-sm text-muted-foreground">
          @for (kpi of section.kpis; track kpi.label) {
            @if (kpi.label && kpi.label.trim()) {
              <div class="flex items-center justify-between">
                <span>{{ kpi.label }} </span>
                <span class="font-semibold text-foreground">{{ kpi.value }}</span>
              </div>
            }
          }
        </div>
      </article>
    } @else {
      <article
        class="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground"
      >
        Section unavailable.
      </article>
    }
  `,
})
export class OverviewSectionWidgetComponent {
  @Input() section?: SectionConfig;
  @Input() statusClasses: Record<string, string> = {};
  @Output() navigate = new EventEmitter<string>();
}
