import { Component } from '@angular/core';
import { scrollBehavior } from '../../shared/utils/animation.util';

@Component({
  selector: 'app-services',
  imports: [],
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
