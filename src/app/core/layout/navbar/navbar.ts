import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [CommonModule],
})
export class Navbar {
  public themeService = inject(ThemeService);
  isMenuOpen = false;
  darkMode = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      // Desplazamiento suave al elemento con el ID dado
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
