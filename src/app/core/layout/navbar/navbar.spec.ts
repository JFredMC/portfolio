import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
  });

  it('provides a real home link for desktop navigation', () => {
    const homeLink = fixture.nativeElement.querySelector('nav a[href="#home"]');

    expect(homeLink).toBeTruthy();
  });

  it('announces the mobile menu state and closes it with Escape', () => {
    const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-controls="mobile-navigation"]'
    );

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');

    menuButton.click();
    fixture.detectChanges();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('#mobile-navigation')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#mobile-navigation').parentElement.classList.contains('hidden')).toBeFalse();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('#mobile-navigation').parentElement.classList.contains('hidden')).toBeTrue();
    expect(document.activeElement).toBe(menuButton);
  });
});
