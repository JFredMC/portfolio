import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';

/** Base URL (e.g. 'https://cdn.example.com/') prepended to relative image paths. Empty = same origin. */
export const IMAGE_CDN_BASE = new InjectionToken<string>('IMAGE_CDN_BASE', {
  providedIn: 'root',
  factory: () => '',
});

/** Cache busting version appended as ?v=. Bump it when images change. */
export const IMAGE_VERSION = new InjectionToken<string>('IMAGE_VERSION', {
  providedIn: 'root',
  factory: () => '1',
});

/** Performance budget for images loaded on first view (500KB). */
export const INITIAL_IMAGE_BUDGET_BYTES = 500 * 1024;

export const DEFAULT_IMAGE_WIDTHS = [480, 960, 1440];
export const DEFAULT_IMAGE_DENSITIES = [1, 2, 3];

export interface ImageSourceOptions {
  /** Enables generated variants following the `name-<w>w.ext` / `name@<d>x.ext` convention. */
  responsive?: boolean;
  widths?: number[];
  densities?: number[];
}

export interface ImageSources {
  src: string;
  srcset: string;
  webpSrcset: string;
  useWebp: boolean;
}

@Injectable({ providedIn: 'root' })
export class ImageOptimizationService {
  private readonly document = inject(DOCUMENT);
  private readonly cdnBase = inject(IMAGE_CDN_BASE);
  private readonly version = inject(IMAGE_VERSION);
  private webpSupport?: boolean;
  private loadedBytes = 0;

  /**
   * Builds src/srcset (original format and webp). Without `responsive`
   * only the original file is used, since no variants are known to exist.
   */
  getSources(path: string, options: ImageSourceOptions = {}): ImageSources {
    const src = this.resolveUrl(path);
    if (!options.responsive) {
      return { src, srcset: '', webpSrcset: '', useWebp: false };
    }
    const { base, ext } = this.splitExtension(path);
    const widths = options.widths ?? DEFAULT_IMAGE_WIDTHS;
    const densities = options.densities ?? DEFAULT_IMAGE_DENSITIES;
    const build = (extension: string) => {
      const byWidth = widths.map((w) => `${this.resolveUrl(`${base}-${w}w.${extension}`)} ${w}w`);
      const byDensity = densities
        .filter((d) => d > 1)
        .map((d) => `${this.resolveUrl(`${base}@${d}x.${extension}`)} ${d}x`);
      return { byWidth, byDensity };
    };
    const original = build(ext);
    const webp = build('webp');
    const wide = widths.length > 0;
    return {
      src,
      srcset: (wide ? original.byWidth : [`${src} 1x`, ...original.byDensity]).join(', '),
      webpSrcset: (wide ? webp.byWidth : [`${this.resolveUrl(`${base}.webp`)} 1x`, ...webp.byDensity]).join(', '),
      useWebp: ext.toLowerCase() !== 'webp',
    };
  }

  resolveUrl(path: string): string {
    if (/^(data:|blob:)/.test(path)) {
      return path;
    }
    const absolute = /^(https?:)?\/\//.test(path);
    const url = absolute ? path : `${this.cdnBase}${path}`;
    if (!this.version) {
      return url;
    }
    return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(this.version)}`;
  }

  /** Base64 SVG gradient used as blur placeholder (LQIP). */
  createPlaceholder(from = '#c7d2fe', to = '#e9d5ff'): string {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  supportsWebp(): boolean {
    if (this.webpSupport === undefined) {
      try {
        const canvas = this.document.createElement('canvas');
        canvas.width = canvas.height = 1;
        this.webpSupport = canvas.toDataURL?.('image/webp').startsWith('data:image/webp') ?? false;
      } catch {
        this.webpSupport = false;
      }
    }
    return this.webpSupport;
  }

  supportsIntersectionObserver(): boolean {
    return typeof IntersectionObserver !== 'undefined';
  }

  /** Adds <link rel="preload" as="image"> for critical images (e.g. featured projects). */
  preload(path: string, options: ImageSourceOptions & { sizes?: string } = {}): void {
    const sources = this.getSources(path, options);
    const link = this.document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    if (sources.useWebp && this.supportsWebp()) {
      link.setAttribute('imagesrcset', sources.webpSrcset);
      link.href = this.resolveUrl(this.splitExtension(path).base + '.webp');
      link.type = 'image/webp';
    } else if (sources.srcset) {
      link.setAttribute('imagesrcset', sources.srcset);
      link.href = sources.src;
    } else {
      link.href = sources.src;
    }
    if (options.sizes) {
      link.setAttribute('imagesizes', options.sizes);
    }
    this.document.head.appendChild(link);
  }

  /** Records bytes of an initial image and reports whether the 500KB budget is still respected. */
  trackBytes(bytes: number): boolean {
    this.loadedBytes += bytes;
    return !this.isOverBudget();
  }

  isOverBudget(): boolean {
    return this.loadedBytes > INITIAL_IMAGE_BUDGET_BYTES;
  }

  private splitExtension(path: string): { base: string; ext: string } {
    const match = path.match(/^(.*)\.([a-zA-Z0-9]+)$/);
    return match ? { base: match[1], ext: match[2] } : { base: path, ext: '' };
  }
}
