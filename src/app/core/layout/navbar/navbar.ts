import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { shouldReduceMotion } from '../../../shared/utils/accessibility';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [CommonModule],
})
export class Navbar {
  public themeService = inject(ThemeService);
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  isMenuOpen = false;
  darkMode = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape() {
    if (!this.isMenuOpen) return;
    this.isMenuOpen = false;
    this.menuButton?.nativeElement.focus();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuButton?.nativeElement.focus();
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
      behavior: shouldReduceMotion() ? 'instant' : 'smooth'
    });
  }
}
