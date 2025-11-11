import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./features/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'sections/:sectionId',
    loadComponent: () =>
      import('./features/sections/section-detail.component').then(
        (m) => m.SectionDetailComponent
      ),
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alerts.component').then(
        (m) => m.AlertsComponent
      ),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./features/compare/compare.component').then(
        (m) => m.CompareComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },
  {
    path: 'ops',
    loadComponent: () =>
      import('./features/ops/ops-admin.component').then(
        (m) => m.OpsAdminComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
