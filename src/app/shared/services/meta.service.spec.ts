import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { MetaService } from './meta.service';

describe('MetaService', () => {
  it('updates title, description and og:image', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(MetaService);
    const meta = TestBed.inject(Meta);

    service.update({ title: 'Test', description: 'Desc', image: 'https://x/y.jpg' });

    expect(TestBed.inject(Title).getTitle()).toBe('Test');
    expect(meta.getTag('name="description"')?.content).toBe('Desc');
    expect(meta.getTag('property="og:image"')?.content).toBe('https://x/y.jpg');
    expect(meta.getTag('name="twitter:title"')?.content).toBe('Test');
  });
});
