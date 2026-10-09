import { Component } from '@angular/core';
import { shouldReduceMotion } from '../../shared/utils/accessibility';

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
      el.scrollIntoView({ behavior: shouldReduceMotion() ? 'instant' : 'smooth', block: 'start' });
    }
  }
}
