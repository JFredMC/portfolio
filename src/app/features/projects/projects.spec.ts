import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../../shared/services/theme.service';
import { Projects } from './projects';

function create(): Projects {
  return TestBed.runInInjectionContext(() => new Projects());
}

describe('Projects', () => {
  beforeEach(() => {
    localStorage.removeItem('user-theme');
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => localStorage.removeItem('user-theme'));

  it('has complete project information and valid external links', () => {
    const { projects, featuredProjects, otherProjects } = create();

    expect(projects.length).toBeGreaterThan(0);
    expect(featuredProjects.length).toBeGreaterThan(0);
    expect(featuredProjects.length + otherProjects.length).toBe(projects.length);

    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.tech.length).toBeGreaterThan(0);
      expect(new URL(project.codeLink).hostname).toBe('github.com');
      expect(new URL(project.demoLink).protocol).toBe('https:');
      expect(project.image).toMatch(/-light\.webp$/);
      expect(project.imageDark).toMatch(/-dark\.webp$/);
    }
  });

  it('swaps the screenshot when the theme changes', () => {
    const component = create();
    const theme = TestBed.inject(ThemeService);
    const [project] = component.projects;

    theme.setMode('light');
    expect(component.imageFor(project)).toBe(project.image!);
    theme.setMode('dark');
    expect(component.imageFor(project)).toBe(project.imageDark!);
  });
});
