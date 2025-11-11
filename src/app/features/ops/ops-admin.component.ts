import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const workflows = [
  { title: 'Refresh tenant directory', status: 'Ready', owner: 'Platform' },
  { title: 'Review AI lineage rules', status: 'Blocked', owner: 'Data' },
  { title: 'Provision sandbox user', status: 'In Progress', owner: 'IT' },
];

@Component({
  selector: 'app-ops-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ops-admin.component.html',
  styleUrl: './ops-admin.component.scss',
})
export class OpsAdminComponent {
  protected readonly workflows = workflows;
}
