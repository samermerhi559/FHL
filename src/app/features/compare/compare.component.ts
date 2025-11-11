import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { mockSections } from '../../data/mock-data';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent {
  protected readonly sections = mockSections;
}
