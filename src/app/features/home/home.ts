import { Component } from '@angular/core';
import { shouldReduceMotion } from '../../shared/utils/accessibility';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion() ? 'instant' : 'smooth', block: 'start' });
    }
  }
}
