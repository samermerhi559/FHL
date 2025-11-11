import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionConfig } from '../../../../core/models/dashboard.models';
import { SparklineComponent } from '../../../../shared/components/sparkline/sparkline.component';

@Component({
  selector: 'app-overview-sections-grid',
  standalone: true,
  imports: [CommonModule, SparklineComponent],
  template: `
    <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      @for (section of sections; track section.id) {
        <article
          class="flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-primary"
          (click)="navigate.emit(section.id)"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">{{ section.name }}</p>
              <h3 class="text-xl font-semibold">
                {{ section.kpis.length ? section.kpis[0].value : '--' }}
              </h3>
            </div>
            <span
              class="rounded-full border px-3 py-1 text-xs font-medium"
              [ngClass]="statusClasses[section.status]"
            >
              {{ section.status | titlecase }}
            </span>
          </div>
          <div class="mt-4 grid gap-3 text-sm text-muted-foreground">
            @for (kpi of section.kpis; track kpi.label) {
              <div class="flex items-center justify-between">
                <span>{{ kpi.label }}</span>
                <span class="font-semibold text-foreground">{{ kpi.value }}</span>
              </div>
            }
          </div>
          @if (section.sparklineData?.length) {
            <div class="mt-4">
              <app-sparkline [data]="section.sparklineData!" />
            </div>
          }
        </article>
      }
    </div>
  `,
})
export class OverviewSectionsGridComponent {
  @Input() sections: SectionConfig[] = [];
  @Input() statusClasses: Record<string, string> = {};
  @Output() navigate = new EventEmitter<string>();
}
