import { Component } from '@angular/core';

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
      // Desplazamiento suave al elemento con el ID dado
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
