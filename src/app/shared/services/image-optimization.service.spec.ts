import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ImageOptimizationService, INITIAL_IMAGE_BUDGET_BYTES } from './image-optimization.service';

describe('ImageOptimizationService', () => {
  let service: ImageOptimizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(ImageOptimizationService);
  });

  it('adds a cache busting version and keeps a single source by default', () => {
    const sources = service.getSources('projects/a.png');
    expect(sources.src).toBe('projects/a.png?v=1');
    expect(sources.srcset).toBe('');
    expect(sources.useWebp).toBeFalse();
  });

  it('builds responsive srcset with webp variants', () => {
    const sources = service.getSources('projects/a.png', { responsive: true, widths: [480, 960] });
    expect(sources.useWebp).toBeTrue();
    expect(sources.srcset).toContain('projects/a-480w.png?v=1 480w');
    expect(sources.webpSrcset).toContain('projects/a-960w.webp?v=1 960w');
  });

  it('builds pixel density srcset (1x, 2x, 3x)', () => {
    const sources = service.getSources('a.jpg', { responsive: true, widths: [] });
    expect(sources.srcset).toContain('a@2x.jpg?v=1 2x');
    expect(sources.srcset).toContain('a@3x.jpg?v=1 3x');
  });

  it('creates a base64 SVG placeholder', () => {
    expect(service.createPlaceholder()).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('flags the 500KB budget', () => {
    expect(service.trackBytes(INITIAL_IMAGE_BUDGET_BYTES)).toBeTrue();
    expect(service.trackBytes(1)).toBeFalse();
  });
});
