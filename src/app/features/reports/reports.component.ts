import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const reports = [
  { name: 'Monthly Board Pack', updated: 'Today', owner: 'Finance Ops' },
  { name: 'Liquidity Covenant Tracker', updated: 'Yesterday', owner: 'Treasury' },
  { name: 'Collections Efficiency', updated: '2 days ago', owner: 'Shared Services' },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  protected readonly reports = reports;
}
