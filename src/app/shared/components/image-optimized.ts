import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, computed, effect, inject, input, signal } from '@angular/core';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Component({
  selector: 'app-image-optimized',
  templateUrl: './image-optimized.html',
  styleUrl: './image-optimized.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block relative overflow-hidden', '[style.aspect-ratio]': 'aspectRatio()' },
})
export class ImageOptimized implements OnDestroy {
  private readonly images = inject(ImageOptimizationService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly imgTitle = input<string>('');
  readonly sizes = input<string>('100vw');
  readonly width = input<number>(1280);
  readonly height = input<number>(720);
  readonly responsive = input<boolean>(false);
  readonly widths = input<number[] | undefined>(undefined);
  /** Critical image: eager load, high fetch priority and preload hint. */
  readonly priority = input<boolean>(false);
  readonly imgClass = input<string>('w-full h-full object-cover');

  readonly loaded = signal(false);
  readonly failed = signal(false);
  readonly inView = signal(false);

  readonly sources = computed(() =>
    this.images.getSources(this.src(), { responsive: this.responsive(), widths: this.widths() }),
  );
  readonly placeholder = this.images.createPlaceholder();
  readonly aspectRatio = computed(() => `${this.width()} / ${this.height()}`);
  readonly useLazyAttribute = computed(() => !this.priority());

  constructor() {
    effect(() => {
      if (this.priority()) {
        this.images.preload(this.src(), { responsive: this.responsive(), widths: this.widths(), sizes: this.sizes() });
        this.inView.set(true);
      }
    });

    afterNextRender(() => {
      if (this.inView()) {
        return;
      }
      if (!this.images.supportsIntersectionObserver()) {
        // Fallback: render immediately and let the native loading="lazy" do the work
        this.inView.set(true);
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.inView.set(true);
            this.observer?.disconnect();
          }
        },
        { rootMargin: '200px' },
      );
      this.observer.observe(this.host.nativeElement);
    });
  }

  onLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.loaded.set(true);
    const entry = performance
      .getEntriesByType('resource')
      .find((e) => e.name === img.currentSrc) as PerformanceResourceTiming | undefined;
    if (entry?.transferSize && !this.images.trackBytes(entry.transferSize)) {
      console.warn('Image performance budget (500KB) exceeded');
    }
  }

  onError(): void {
    this.failed.set(true);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
