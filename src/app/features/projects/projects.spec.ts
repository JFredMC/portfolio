import { Projects } from './projects';

describe('Projects', () => {
  it('has complete project information and valid external links', () => {
    const { projects, featuredProjects, otherProjects } = new Projects();

    expect(projects.length).toBeGreaterThan(0);
    expect(featuredProjects.length).toBeGreaterThan(0);
    expect(featuredProjects.length + otherProjects.length).toBe(projects.length);

    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.tech.length).toBeGreaterThan(0);
      expect(new URL(project.codeLink).hostname).toBe('github.com');
      expect(new URL(project.demoLink).protocol).toBe('https:');
      expect(project.image).toBeTruthy();
    }
  });
});
