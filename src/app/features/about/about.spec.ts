import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    fixture.detectChanges();
  });

  it('shows the profile, verified education, certification, and languages', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('5 años de experiencia');
    expect(content).toContain('5+');
    expect(content).toContain('MET•PAY');
    expect(content).toContain('Ingeniería de Software');
    expect(content).toContain('Diplomado en Análisis de Datos con Python');
    expect(content).toContain('Angular — Verified by Talently');
    expect(content).toContain('Español: Nativo');
    expect(content).toContain('Inglés: A2 certificado');
  });

  it('lists the verified technical skills without unrelated frontend frameworks', () => {
    expect(fixture.componentInstance.skills).toEqual([
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
      'HTML5/CSS3',
    ]);
  });
});
