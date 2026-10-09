import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit {
@ViewChild('profileVideo') profileVideo?: ElementRef<HTMLVideoElement>;

skills: string[] = [
  'Angular 13+',
  'NestJS',
  'TypeScript',
  'JavaScript ES6+',
  'Node.js',
  'Ruby on Rails',
  'PostgreSQL',
  'APIs RESTful',
  'Git',
  'Scrum',
  'Kanban',
  'Testing/QA',
  'Tailwind CSS',
  'HTML5/CSS3'
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
