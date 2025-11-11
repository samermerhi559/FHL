import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

@Component({
  selector: 'app-right-drawer',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './right-drawer.component.html',
  styleUrl: './right-drawer.component.scss',
})
export class RightDrawerComponent {
  @Input() open = false;
  @Input() section = 'overview';
  @Input() context = '';
  @Output() closed = new EventEmitter<void>();
  protected readonly today = new Date();

  protected readonly narratives: Record<string, string> = {
    overview:
      'Overall business health is strong with 9 of 12 sections showing healthy status. Key concerns include higher AR DSO, increased concentration risk, and a lower hedge ratio. Cash position remains solid at $24.3M with projected growth over the next 13 weeks.',
    ar: 'Accounts Receivable DSO has increased to 42 days, 7 days above target. Open AR stands at $8.2M with 15 invoices totaling $680K more than 60 days overdue. Focus collections on Enterprise Account #1247 and the top three overdue customers representing $4.2M (51% of total AR).',
    liquidity:
      'Cash position is healthy at $24.3M, up 8.2% from last month. Quick ratio improved to 2.4x. 13-week projection shows steady growth to $30.1M supported by expected Q4 collections and new contract advances.',
  };

  protected readonly apiSources: Record<string, string[]> = {
    overview: ['api_board_pack', 'api_ai_bundle', 'api_health_summary'],
    ar: [
      'api_ar_aging_summary',
      'api_ar_overdue_list',
      'api_ar_top_customers',
      'api_ar_soa',
    ],
    liquidity: [
      'api_cash_position',
      'api_cash_projection_13w',
      'api_liquidity_ratios',
    ],
  };

  protected close(): void {
    this.closed.emit();
  }

  protected get narrative(): string {
    return (
      this.narratives[this.section] ??
      'AI analysis will appear here based on the current view and filters.'
    );
  }

  protected get sources(): string[] {
    return this.apiSources[this.section] ?? ['api_generic'];
  }
}
