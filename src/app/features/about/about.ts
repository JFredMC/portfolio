import { TPipe } from '../../shared/i18n/t.pipe';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [TPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit, OnDestroy {
  @ViewChild('profileVideo') profileVideo?: ElementRef<HTMLVideoElement>;

  videoEnded = signal(false);

  /** Con movimiento reducido se muestra la foto y el video no se descarga. */
  readonly reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  skills: string[] = ['Angular', 'NestJS', 'TypeScript', 'Node.js', 'PostgreSQL'];

  private observer?: IntersectionObserver;
  private removeRetry?: () => void;

  ngAfterViewInit(): void {
    const video = this.profileVideo?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    if (typeof IntersectionObserver === 'undefined') {
      this.play(video);
      return;
    }
    // Solo se descarga y reproduce cuando la sección entra en pantalla.
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.observer?.disconnect();
          this.observer = undefined;
          this.play(video);
        }
      },
      { threshold: 0.35 }
    );
    this.observer.observe(video);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.removeRetry?.();
  }

  private play(video: HTMLVideoElement): void {
    const attempt = video.play();
    if (!attempt) return;
    attempt.catch(() => {
      // El navegador bloqueó el autoplay; se reintenta en la primera interacción.
      const retry = () => {
        this.removeRetry?.();
        video.play().catch(() => undefined);
      };
      window.addEventListener('pointerdown', retry, { once: true });
      window.addEventListener('scroll', retry, { once: true });
      this.removeRetry = () => {
        window.removeEventListener('pointerdown', retry);
        window.removeEventListener('scroll', retry);
        this.removeRetry = undefined;
      };
    });
  }
}
