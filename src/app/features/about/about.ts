import { TPipe } from '../../shared/i18n/t.pipe';
import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [TPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit {
@ViewChild('profileVideo') profileVideo?: ElementRef<HTMLVideoElement>;

videoEnded = signal(false);

skills: string[] = [
  'Angular',
  'NestJS',
  'TypeScript',
  'Node.js',
  'PostgreSQL'
];

ngAfterViewInit(): void {
  const video = this.profileVideo?.nativeElement;
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.play().catch(() => {
    // El navegador bloqueó el autoplay; se reintenta en la primera interacción.
    const retry = () => video.play().catch(() => undefined);
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('scroll', retry, { once: true });
  });
}
}
