import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { WompiService } from '../../shared/services/wompi.service';
import { Support } from './support';

describe('Support', () => {
  let fixture: ComponentFixture<Support>;
  let openCheckout: jasmine.Spy;

  beforeEach(async () => {
    openCheckout = jasmine.createSpy('openCheckout');
    await TestBed.configureTestingModule({
      imports: [Support],
      providers: [
        provideZonelessChangeDetection(),
        { provide: WompiService, useValue: { openCheckout } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Support);
    fixture.detectChanges();
  });

  it('rejects custom amounts below the minimum or with fractional units', () => {
    const support = fixture.componentInstance;
    support.customAmount = '999';
    support.applyCustomAmount();

    expect(support.selectedAmount).toBe(25000);
    expect(support.amountError).toContain('1.000 COP');

    support.customAmount = '1250.5';
    support.applyCustomAmount();
    expect(support.amountError).toContain('monto entero');
  });

  it('validates a custom amount on form submission and exposes selected presets', async () => {
    const openButton: HTMLButtonElement = fixture.nativeElement.querySelector('section button');
    openButton.click();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    const support = fixture.componentInstance;

    const presetButtons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[role="dialog"] button[aria-pressed]')
    );
    expect(presetButtons[1].getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(presetButtons[0]);
    expect(fixture.nativeElement.querySelector('#support').inert).toBeTrue();

    support.customAmount = '999';
    const form: HTMLFormElement = fixture.nativeElement.querySelector('[role="dialog"] form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(support.amountError).toContain('1.000 COP');
    expect(fixture.nativeElement.querySelector('#donation-custom-amount').getAttribute('aria-invalid')).toBe('true');
    expect(openCheckout).not.toHaveBeenCalled();

    support.closeDonationModal();
    expect(fixture.nativeElement.querySelector('#support').inert).toBeFalse();
  });

  it('opens the checkout for a valid amount', () => {
    fixture.componentInstance.donate();

    expect(openCheckout).toHaveBeenCalledOnceWith(25000, 'COP');
    expect(fixture.componentInstance.showModal).toBeFalse();
  });

  it('does not start checkout for an invalid selected amount', () => {
    fixture.componentInstance.selectedAmount = 999;
    fixture.componentInstance.donate();

    expect(openCheckout).not.toHaveBeenCalled();
    expect(fixture.componentInstance.isProcessing).toBeFalse();
  });

  it('exposes a labelled modal and closes it with Escape', async () => {
    const support = fixture.componentInstance;
    const openButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    openButton.click();
    await fixture.whenStable();

    const dialog: HTMLElement | null = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('donation-dialog-title');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(support.showModal).toBeFalse();
  });
});
