import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TPipe } from '../../../shared/i18n/t.pipe';
import { ThemeService } from '../../../shared/services/theme.service';
import { exitDuration, scrollBehavior } from '../../../shared/utils/animation.util';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [CommonModule, TPipe],
})
export class Navbar {
  public themeService = inject(ThemeService);
  public i18n = inject(I18nService);
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  isMenuOpen = false;
  isMenuClosing = signal(false);
  themeLabel = computed(() => {
    const mode = this.themeService.mode();
    if (mode === 'light') return this.i18n.t('Tema claro activo. Cambiar al tema oscuro');
    if (mode === 'dark') return this.i18n.t('Tema oscuro activo. Cambiar al tema del sistema');
    return this.i18n.t('Tema del sistema activo. Cambiar al tema claro');
  });
  languageLabel = computed(() =>
    this.i18n.lang() === 'es' ? 'Cambiar idioma a inglés (Switch to English)' : 'Switch language to Spanish (Cambiar a español)'
  );
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
    this.themeService.cycleTheme();
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const navbarHeight = document.querySelector('header')?.getBoundingClientRect().height || 64;
    const extraOffset = 16;

    const yOffset = - (navbarHeight + extraOffset);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: scrollBehavior()
    });
  }
}
