import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';

@Component({
  selector: 'app-overview-ai-card',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">AI Insights</p>
          <h2 class="text-lg font-semibold">Explainability</h2>
        </div>
        <lucide-icon name="Sparkles" class="h-5 w-5 text-primary" />
      </div>
      <p class="mt-4 text-sm text-muted-foreground">
        Enable AI Explain to receive contextual narratives, root-cause analysis, and
        sharing controls directly in the workspace. Insights adapt to the filters you set
        above.
      </p>
      <button
        type="button"
        class="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        (click)="toggle.emit()"
      >
        {{ aiEnabled ? 'Disable' : 'Enable' }} AI Explain
      </button>
    </div>
  `,
})
export class OverviewAiCardComponent {
  @Input() aiEnabled = false;
  @Output() toggle = new EventEmitter<void>();
}
