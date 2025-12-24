import { Component } from '@angular/core';
import { IProject } from './interfaces/project.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  imports: [CommonModule],
})
export class Projects {
  projects: IProject[] = [
    {
      title: 'Point Editor',
      description: 'Gestionar puntos de interés en el mapa',
      tech: ['Angular', 'MapLibre GL JS', 'Boostrap'],
      codeLink: 'https://github.com/JFredMC/point-editor',
      demoLink: 'https://jfredmc.github.io/point-editor/',
      status: 'completed',
      image: 'projects/point-editor.png',
    },
    {
      title: 'JfChat',
      description: 'Aplicacion de Chat Web',
      tech: ['Angular', 'NestJs', 'PostgreSQL', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/jf-chat',
      demoLink: 'https://jfredmc.github.io/jf-chat',
      status: 'completed',
      image: 'projects/jf-chat.png'
    }
  ];
}
