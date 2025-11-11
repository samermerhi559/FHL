import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { mockAlerts, mockSections } from '../../data/mock-data';
import { SectionConfig } from '../../core/models/dashboard.models';
import { SparklineComponent } from '../../shared/components/sparkline/sparkline.component';
import { LucideIconsModule } from '../../shared/lucide-icons.module';

@Component({
  selector: 'app-section-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule, SparklineComponent],
  templateUrl: './section-detail.component.html',
  styleUrl: './section-detail.component.scss',
})
export class SectionDetailComponent implements OnInit, OnDestroy {
  protected readonly section = signal<SectionConfig | undefined>(undefined);
  protected readonly alerts = signal(mockAlerts);
  private sub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const sectionId = params.get('sectionId');
      const match = mockSections.find((section) => section.id === sectionId);
      this.section.set(match);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  protected goBack(): void {
    void this.router.navigate(['/overview']);
  }

  protected relatedAlerts() {
    const sectionId = this.section()?.id;
    if (!sectionId) {
      return [];
    }
    return this.alerts().filter((alert) => alert.section === sectionId);
  }
}
