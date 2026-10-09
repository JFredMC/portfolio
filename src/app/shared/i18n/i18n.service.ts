import { Injectable, signal } from '@angular/core';
import { EN_TRANSLATIONS } from './translations';

export type Language = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly LANG_KEY = 'user-lang';

  readonly lang = signal<Language>('es');

  constructor() {
    if (typeof window === 'undefined') return;
    this.lang.set(this.readStoredLang());
    this.applyLang();
  }

  setLang(lang: Language) {
    this.lang.set(lang);
    try {
      localStorage.setItem(this.LANG_KEY, lang);
    } catch {
      // Almacenamiento no disponible (p. ej. navegación privada)
    }
    this.applyLang();
  }

  toggleLang() {
    this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  /** Traduce un texto en español; si no hay traducción devuelve el original. */
  t(text: string, params?: Record<string, string | number>): string {
    let result = text;
    if (this.lang() === 'en' && text) {
      result = text.includes('\n')
        ? text.split('\n').map((line) => EN_TRANSLATIONS[line] ?? line).join('\n')
        : EN_TRANSLATIONS[text] ?? text;
    }
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        result = result.replaceAll(`{${name}}`, String(value));
      }
    }
    return result;
  }

  private readStoredLang(): Language {
    try {
      const stored = localStorage.getItem(this.LANG_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      // Almacenamiento no disponible
    }
    return 'es';
  }

  private applyLang() {
    document.documentElement.lang = this.lang();
  }
}
