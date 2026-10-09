import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { exitDuration, scrollBehavior } from '../../../shared/utils/animation.util';

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
  isMenuClosing = signal(false);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
      return;
    }
    this.clearCloseTimer();
    this.isMenuClosing.set(false);
    this.isMenuOpen = true;
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape() {
    if (!this.isMenuOpen) return;
    this.closeMenu();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuButton?.nativeElement.focus();
    this.clearCloseTimer();
    this.isMenuClosing.set(true);
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      this.isMenuClosing.set(false);
    }, exitDuration());
  }

  private clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
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
      behavior: scrollBehavior()
    });
  }
}
