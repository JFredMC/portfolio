import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
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
}
