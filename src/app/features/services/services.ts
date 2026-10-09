import { Component } from '@angular/core';
import { TPipe } from '../../shared/i18n/t.pipe';
import { scrollBehavior } from '../../shared/utils/animation.util';

@Component({
  selector: 'app-services',
  imports: [TPipe],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {
  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
  }
}
