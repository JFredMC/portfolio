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

  skills: string[] = ['Angular', 'TypeScript', 'NestJS', 'Ruby on Rails', 'PostgreSQL', 'AWS'];

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
    // Cada vez que la sección entra en pantalla, el video vuelve a empezar;
    // al salir se pausa. Al terminar se muestra la foto.
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (entry.isIntersecting) {
          this.videoEnded.set(false);
          video.currentTime = 0;
          this.play(video);
        } else {
          video.pause();
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
