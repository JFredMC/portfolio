import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_COLORS = { dark: '#070d18', light: '#ffffff' } as const;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  private readonly query: MediaQueryList | null =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  readonly mode = signal<ThemeMode>('system');
  readonly darkMode = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    this.mode.set(this.readStoredMode());
    this.applyTheme(false);

    this.query?.addEventListener('change', () => {
      if (this.mode() === 'system') this.applyTheme(true);
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== this.THEME_KEY) return;
      this.mode.set(this.parseMode(event.newValue));
      this.applyTheme(true);
    });
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
    try {
      if (mode === 'system') localStorage.removeItem(this.THEME_KEY);
      else localStorage.setItem(this.THEME_KEY, mode);
    } catch {
      // Almacenamiento no disponible (p. ej. navegación privada)
    }
    this.applyTheme(true);
  }

  toggleTheme() {
    this.setMode(this.darkMode() ? 'light' : 'dark');
  }

  cycleTheme() {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    this.setMode(order[(order.indexOf(this.mode()) + 1) % order.length]);
  }

  isDarkMode() {
    return this.darkMode();
  }

  private parseMode(value: string | null): ThemeMode {
    return value === 'light' || value === 'dark' ? value : 'system';
  }

  private readStoredMode(): ThemeMode {
    try {
      return this.parseMode(localStorage.getItem(this.THEME_KEY));
    } catch {
      return 'system';
    }
  }

  private applyTheme(animate: boolean) {
    const mode = this.mode();
    const dark = mode === 'dark' || (mode === 'system' && !!this.query?.matches);
    this.darkMode.set(dark);

    const root = document.documentElement;
    if (animate) {
      root.classList.add('no-transitions');
      setTimeout(() => root.classList.remove('no-transitions'), 150);
    }
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';

    const color = dark ? THEME_COLORS.dark : THEME_COLORS.light;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => {
        meta.removeAttribute('media');
        meta.setAttribute('content', color);
      });
  }
}
