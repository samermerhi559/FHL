import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { lucideIcons } from './lucide-icons';

@NgModule({
  imports: [LucideAngularModule.pick(lucideIcons)],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
