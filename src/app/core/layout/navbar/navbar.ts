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
    const element = document.getElementById(sectionId);
    if (!element) return;

    const navbarHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
    const extraOffset = 16;

    const yOffset = - (navbarHeight + extraOffset);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}
