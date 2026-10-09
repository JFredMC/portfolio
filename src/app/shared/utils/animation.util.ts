/**
 * Escala de duraciones (ms) usada en toda la UI.
 * fast: feedback inmediato (hover/active) · standard: UI (menú, modal) · slow: contenido.
 */
export const ANIMATION_DURATION = {
  fast: 150,
  standard: 300,
  slow: 500,
} as const;

export function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollBehavior(): ScrollBehavior {
  return shouldReduceMotion() ? 'auto' : 'smooth';
}

/** Duración de salida efectiva: 0 si el usuario prefiere menos movimiento. */
export function exitDuration(): number {
  return shouldReduceMotion() ? 0 : ANIMATION_DURATION.standard;
}

export function throttle<A extends unknown[]>(fn: (...args: A) => void, wait = 100): (...args: A) => void {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    const remaining = wait - (Date.now() - last);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = Date.now();
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}
