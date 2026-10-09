import { scrollBehavior, throttle } from './animation.util';

describe('animation.util', () => {
  it('uses auto scroll when reduced motion is requested', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    expect(scrollBehavior()).toBe('auto');
  });

  it('uses smooth scroll otherwise', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    expect(scrollBehavior()).toBe('smooth');
  });

  it('throttles calls to at most one per interval, keeping the trailing call', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    const fn = jasmine.createSpy('fn');
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(100);
    expect(fn).toHaveBeenCalledTimes(2);
    jasmine.clock().uninstall();
  });
});
