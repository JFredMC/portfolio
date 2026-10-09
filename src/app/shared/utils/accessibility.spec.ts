import { shouldReduceMotion } from './accessibility';

describe('shouldReduceMotion', () => {
  it('returns the active reduced-motion preference', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    expect(shouldReduceMotion()).toBeTrue();
    expect(window.matchMedia).toHaveBeenCalledOnceWith('(prefers-reduced-motion: reduce)');
  });
});
