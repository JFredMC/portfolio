import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
skills: string[] = [
  'Angular', 'NestJS', 'TypeScript', 'JavaScript', 'Git', 
  'APIs REST', 'PostgreSQL', 'Ruby on Rails', 'Scrum', 'Tailwind'
];
}
