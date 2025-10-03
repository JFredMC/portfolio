import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IExperience } from './interfaces/experience.interface';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {
  experiences: IExperience[] = [
    {
      title: 'Ingeniero de Desarrollo',
      company: 'Met Group S.A.S',
      location: 'Pereira',
      date: 'May 2022 – Presente',
      description: `Diseñar, desarrollar, probar, implementar y mantener sistemas de software. Esto incluye analizar los requisitos del cliente, 
      elegir las tecnologías adecuadas, escribir código, realizar pruebas de calidad y documentar el software.`,
      company_logo: 'https://www.metgroupsas.com/wp-content/uploads/elementor/thumbs/SIn-Foto-qearrze6pwgdqz5gl12lv6ckoqblim18uwf39d2igk.webp',
      technologies_used: ['Angular', 'Nestjs', 'Ruby On Rails', 'PostgreSQL']
    },
    {
      title: 'Trainee',
      company: 'iAm Studio SAS',
      location: 'Bogotá, Colombia',
      date: 'Oct 2021 – Abr 2022',
      description: `Apoyar en las tareas diarias del equipo, como escribir código, probar software, documentar procesos y colaborar en proyectos; 
      participar en la investigación de nuevas tecnologías y soluciones.`,
      company_logo: 'https://iamstudio.co/src/assets/images/logo.png',
      technologies_used: ['SenchaJs', 'JavaScript']
    }
  ];
}
