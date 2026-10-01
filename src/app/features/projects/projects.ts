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
  readonly statusLabels: Record<IProject['status'], string> = {
    'completed': 'Completado',
    'in-progress': 'En progreso',
    'planned': 'Planeado',
  };

  projects: IProject[] = [
    {
      title: 'Point Editor',
      description: 'Gestionar puntos de interés en el mapa',
      tech: ['Angular', 'MapLibre GL JS', 'Bootstrap'],
      codeLink: 'https://github.com/JFredMC/point-editor',
      demoLink: 'https://jfredmc.github.io/point-editor/',
      status: 'completed',
      image: 'projects/point-editor.png',
    },
    {
      title: 'JfChat',
      description: 'Aplicación de chat web',
      tech: ['Angular', 'NestJS', 'PostgreSQL', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/jf-chat',
      demoLink: 'https://jfredmc.github.io/jf-chat',
      status: 'completed',
      image: 'projects/jf-chat.png'
    }
  ];
}
