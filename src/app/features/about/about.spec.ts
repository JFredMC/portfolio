import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    localStorage.removeItem('user-lang');
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    fixture.detectChanges();
  });

  it('shows the profile, verified education, certification, and languages', () => {
    const content = fixture.nativeElement.textContent;

    expect(content.match(/5 años de experiencia/g)).toBeNull();
    expect(content).toContain('5+');
    expect(content).not.toContain('MET');
    expect(content).not.toContain('transporte');
    expect(content).not.toMatch(/Angular 13\+|Rails 5\+/);
    expect(content).not.toContain('Del front end a la nube');
    expect(content).toContain('APIs en NestJS o Ruby on Rails;');
    expect(content).toContain('S3, ECS, Amplify, RDS e IAM');
    expect(content).toContain('Ingeniería de Software');
    expect(content).toContain('Diplomado en Análisis de Datos con Python');
    expect(content).toContain('Angular — Verified by Talently');
    expect(content).toContain('Español: Nativo');
    expect(content).toContain('Inglés: A2 certificado');
  });

  it('lists the most differentiating technical skills without unrelated frontend frameworks', () => {
    expect(fixture.componentInstance.skills).toEqual([
      'Angular',
      'TypeScript',
      'NestJS',
      'Ruby on Rails',
      'PostgreSQL',
      'AWS',
    ]);
  });
});

describe('About profile video', () => {
  let observed: Element[];
  let callback: IntersectionObserverCallback;
  let originalIO: typeof IntersectionObserver;

  function stubMotion(reduce: boolean): void {
    spyOn(window, 'matchMedia').and.callFake(
      (q: string) => ({ matches: reduce && q.includes('reduce'), media: q } as MediaQueryList)
    );
  }

  beforeEach(async () => {
    observed = [];
    originalIO = window.IntersectionObserver;
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) { callback = cb; }
      observe(el: Element) { observed.push(el); }
      disconnect() {}
      unobserve() {}
    };
    spyOn(HTMLMediaElement.prototype, 'play').and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalIO;
  });

  it('loads lazily and only plays muted once the video is visible', () => {
    stubMotion(false);
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    const video: HTMLVideoElement = fixture.nativeElement.querySelector('video');

    expect(video.getAttribute('preload')).toBe('none');
    expect(video.muted).toBeTrue();
    expect(video.playsInline).toBeTrue();
    expect(video.getAttribute('poster')).toBe('images/profile.webp');
    expect(observed).toEqual([video]);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it('replays from the start on every entry, pauses on exit, and hides the photo', () => {
    stubMotion(false);
    const pause = spyOn(HTMLMediaElement.prototype, 'pause');
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const video: HTMLVideoElement = el.querySelector('video')!;
    const io = {} as IntersectionObserver;
    const enter = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], io);
    const leave = () => callback([{ isIntersecting: false } as IntersectionObserverEntry], io);

    enter();
    video.dispatchEvent(new Event('ended'));
    fixture.detectChanges();
    expect(el.querySelector('img[src="images/profile.webp"]')).not.toBeNull();

    leave();
    expect(pause).toHaveBeenCalledTimes(1);

    Object.defineProperty(video, 'currentTime', { value: 4, writable: true, configurable: true });
    enter();
    fixture.detectChanges();
    expect(video.currentTime).toBe(0);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    expect(el.querySelector('img[src="images/profile.webp"]')).toBeNull();
  });

  it('offers WebM before MP4', () => {
    stubMotion(false);
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    const types = [...fixture.nativeElement.querySelectorAll('video source')].map((s: Element) => s.getAttribute('type'));
    expect(types).toEqual(['video/webm', 'video/mp4']);
  });

  it('shows the photo when the video ends', () => {
    stubMotion(false);
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img[src="images/profile.webp"]')).toBeNull();

    fixture.nativeElement.querySelector('video').dispatchEvent(new Event('ended'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img[src="images/profile.webp"]')).not.toBeNull();
  });

  it('shows only the photo with prefers-reduced-motion', () => {
    stubMotion(true);
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('video')).toBeNull();
    expect(fixture.nativeElement.querySelector('img[src="images/profile.webp"]')).not.toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
