import { WompiService } from './wompi.service';

describe('WompiService', () => {
  let tab: { closed: boolean; opener: unknown; location: { href: string } };
  let service: WompiService;

  beforeEach(() => {
    tab = { closed: false, opener: {}, location: { href: '' } };
    spyOn(window, 'open').and.returnValue(tab as unknown as Window);
    service = new WompiService();
  });

  it('opens the signed checkout with the amount in cents', async () => {
    spyOn(window, 'fetch').and.resolveTo(
      new Response(JSON.stringify({ reference: 'JFD-ABC', amountInCents: 2_500_000, currency: 'COP', signature: 'abc123' }), { status: 200 }),
    );

    await service.openCheckout(25000, 'COP');

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    const body = JSON.parse((window.fetch as jasmine.Spy).calls.mostRecent().args[1].body);
    expect(body).toEqual({ amount: 25000 });
    expect(tab.location.href).toContain('signature%3Aintegrity=abc123');
    const url = new URL(tab.location.href);
    expect(url.origin + url.pathname).toBe('https://checkout.wompi.co/p/');
    expect(url.searchParams.get('amount-in-cents')).toBe('2500000');
    expect(url.searchParams.get('currency')).toBe('COP');
    expect(url.searchParams.get('reference')).toBe('JFD-ABC');
    expect(url.searchParams.get('signature:integrity')).toBe('abc123');
    expect(url.searchParams.get('public-key')).toMatch(/^pub_prod_/);
    expect(url.searchParams.get('redirect-url')).toBe('https://jfredmc.github.io/');
  });

  it('falls back to the open link when the signature fails', async () => {
    spyOn(window, 'fetch').and.rejectWith(new Error('down'));
    await service.openCheckout(25000, 'COP');
    expect(tab.location.href).toBe(service.FALLBACK_LINK);
  });

  it('falls back when the signed amount does not match', async () => {
    spyOn(window, 'fetch').and.resolveTo(
      new Response(JSON.stringify({ reference: 'R', amountInCents: 25000, currency: 'COP', signature: 's' }), { status: 200 }),
    );
    await service.openCheckout(25000, 'COP');
    expect(tab.location.href).toBe(service.FALLBACK_LINK);
  });
});
