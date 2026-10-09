import { Component } from '@angular/core';
import { TPipe } from '../../shared/i18n/t.pipe';
import { shouldReduceMotion } from '../../shared/utils/accessibility';

@Component({
  selector: 'app-home',
  imports: [TPipe],
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
