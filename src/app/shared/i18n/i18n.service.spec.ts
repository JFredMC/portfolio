import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.removeItem('user-lang');
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(I18nService);
    service.setLang('es');
  });

  it('devuelve el texto original en español', () => {
    expect(service.t('Inicio')).toBe('Inicio');
  });

  it('traduce al inglés y alterna el idioma', () => {
    service.toggleLang();
    expect(service.lang()).toBe('en');
    expect(service.t('Inicio')).toBe('Home');
    expect(document.documentElement.lang).toBe('en');
    service.toggleLang();
    expect(service.lang()).toBe('es');
  });

  it('traduce cada línea de textos multilínea y reemplaza parámetros', () => {
    service.setLang('en');
    expect(service.t('Inicio\nContacto')).toBe('Home\nContact');
    expect(service.t('Donar con {title}', { title: 'Wompi' })).toBe('Donate with Wompi');
    expect(service.t('Texto sin traducción')).toBe('Texto sin traducción');
  });
});
