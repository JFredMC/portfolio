import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update({ title, description, image, url }: PageMeta): void {
    if (title) {
      this.title.setTitle(title);
      this.setTag('property', 'og:title', title);
      this.setTag('name', 'twitter:title', title);
    }
    if (description) {
      this.setTag('name', 'description', description);
      this.setTag('property', 'og:description', description);
      this.setTag('name', 'twitter:description', description);
    }
    if (image) {
      this.setTag('property', 'og:image', image);
      this.setTag('name', 'twitter:image', image);
    }
    if (url) {
      this.setTag('property', 'og:url', url);
    }
  }

  private setTag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }
}
