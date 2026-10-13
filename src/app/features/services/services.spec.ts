import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Services } from './services';

describe('Services', () => {
  let fixture: ComponentFixture<Services>;

  beforeEach(async () => {
    localStorage.removeItem('user-lang');
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Services);
    fixture.detectChanges();
  });

  it('renders the three service cards without an intro or closing CTA', () => {
    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(3);
    expect(fixture.nativeElement.querySelector('a[href="#contact"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toMatch(/Listo para transformar|Soluciones tecnológicas/);
  });

  it('describes the verified full stack and backend stack', () => {
    const articles = fixture.nativeElement.querySelectorAll('article');
    const fullStackDescription = articles[0].querySelector('p').textContent;

    expect(fullStackDescription).toContain('Angular');
    expect(fullStackDescription).toContain('NestJS');
    expect(fixture.nativeElement.textContent).not.toMatch(/React|Vue|Next\.js/);
  });
});
