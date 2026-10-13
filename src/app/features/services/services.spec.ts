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

  it('renders all three service cards and an accessible contact link', () => {
    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(3);
    expect(fixture.nativeElement.querySelector('a[href="#contact"]').getAttribute('aria-label'))
      .toBe('Contáctame ahora para conversar sobre tu proyecto');
  });

  it('describes the verified full stack and backend stack', () => {
    const articles = fixture.nativeElement.querySelectorAll('article');
    const fullStackDescription = articles[0].querySelector('p').textContent;

    expect(fullStackDescription).toContain('Angular');
    expect(fullStackDescription).toContain('NestJS');
    expect(fixture.nativeElement.textContent).not.toMatch(/React|Vue|Next\.js/);
  });

  it('scrolls to contact while respecting the reduced-motion preference', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const target = document.createElement('div');
    target.id = 'contact';
    document.body.appendChild(target);
    const scrollIntoView = spyOn(target, 'scrollIntoView');

    fixture.nativeElement.querySelector('a[href="#contact"]').click();

    expect(scrollIntoView).toHaveBeenCalledOnceWith({ behavior: 'auto', block: 'start' });
    target.remove();
  });
});
