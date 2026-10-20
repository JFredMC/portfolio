import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService (alternar en un toque)', () => {
  let prefersDark = false;
  const originalMatchMedia = window.matchMedia;

  function create(): ThemeService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    (window as any).matchMedia = (q: string) => ({
      matches: q.includes('dark') ? prefersDark : !prefersDark,
      media: q, addEventListener: () => {}, removeEventListener: () => {},
    });
  });

  afterEach(() => {
    (window as any).matchMedia = originalMatchMedia;
    localStorage.clear();
  });

  it('sin preferencia guardada sigue al sistema (oscuro)', () => {
    prefersDark = true;
    const s = create();
    expect(s.darkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('un toque desde oscuro del sistema pasa a claro y lo guarda', () => {
    prefersDark = true;
    const s = create();
    s.toggleTheme();
    expect(s.darkMode()).toBe(false);
    expect(localStorage.getItem('user-theme')).toBe('light');
  });

  it('un toque desde claro del sistema pasa a oscuro y lo guarda', () => {
    prefersDark = false;
    const s = create();
    s.toggleTheme();
    expect(s.darkMode()).toBe(true);
    expect(localStorage.getItem('user-theme')).toBe('dark');
    s.toggleTheme();
    expect(s.darkMode()).toBe(false);
    expect(localStorage.getItem('user-theme')).toBe('light');
  });

  it('migra un valor antiguo "system" y vuelve a seguir al dispositivo', () => {
    prefersDark = true;
    localStorage.setItem('user-theme', 'system');
    const s = create();
    expect(s.darkMode()).toBe(true);
    expect(localStorage.getItem('user-theme')).toBeNull();
  });

  it('respeta la preferencia guardada sobre la del sistema', () => {
    prefersDark = true;
    localStorage.setItem('user-theme', 'light');
    expect(create().darkMode()).toBe(false);
  });
});
