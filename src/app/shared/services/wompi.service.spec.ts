import { WompiService } from './wompi.service';

describe('WompiService', () => {
  it('opens the checkout with the selected amount and currency', () => {
    const openSpy = spyOn(window, 'open').and.returnValue(null);
    const service = new WompiService();

    service.openCheckout(25000, 'COP');

    const checkoutUrl = new URL(openSpy.calls.mostRecent().args[0] as string);
    expect(checkoutUrl.origin).toBe('https://checkout.wompi.co');
    expect(checkoutUrl.searchParams.get('amount')).toBe('25000');
    expect(checkoutUrl.searchParams.get('currency')).toBe('COP');
    expect(checkoutUrl.searchParams.get('reference')).toMatch(/^JFD-\d+-[A-Z0-9]+$/);
    expect(openSpy).toHaveBeenCalledWith(checkoutUrl.toString(), '_blank', 'noopener,noreferrer');
  });
});
