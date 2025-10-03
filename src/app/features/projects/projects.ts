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
      title: 'E‑commerce Platform',
      description: 'Plataforma completa de comercio electrónico con carrito de compras, pagos y panel de administración.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      codeLink: 'https://github.com/tuusuario/ecommerce',
      demoLink: 'https://ecommerce-demo.com',
      status: 'completed'
    },
    {
      title: 'Task Management App',
      description: 'Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real.',
      tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io'],
      codeLink: 'https://github.com/tuusuario/task-app',
      demoLink: 'https://task-app-demo.com',
      status: 'completed'
    },
    {
      title: 'Weather Dashboard',
      description: 'Dashboard meteorológico con visualización de datos y pronósticos detallados.',
      tech: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      codeLink: 'https://github.com/tuusuario/weather-dashboard',
      demoLink: 'https://weather-demo.com',
      status: 'completed'
    }
  ];


}
