import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Services } from './services';

describe('Services', () => {
  let fixture: ComponentFixture<Services>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Services);
    fixture.detectChanges();
  });

  it('renders all four service cards and an accessible contact link', () => {
    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(4);
    expect(fixture.nativeElement.querySelector('a[href="#contact"]').getAttribute('aria-label'))
      .toBe('Contáctame para conversar sobre tu proyecto');
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
