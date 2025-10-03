import { Component } from '@angular/core';

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
      // Desplazamiento suave al elemento con el ID dado
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
