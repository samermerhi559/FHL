import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      *ngIf="points().length"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      class="h-8 w-full text-primary"
    >
      <polyline
        [attr.points]="points().join(' ')"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></polyline>
    </svg>
  `,
})
export class SparklineComponent {
  @Input({ required: true }) data: number[] = [];

  protected readonly points = computed(() => {
    if (!this.data.length) {
      return [];
    }
    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;
    return this.data.map((value, index) => {
      const x = (index / (this.data.length - 1 || 1)) * 100;
      const y = 30 - ((value - min) / range) * 30;
      return `${x},${y}`;
    });
  });
}
