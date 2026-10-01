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
      title: 'Desarrollador Full Stack Semi Senior',
      company: 'MET GROUP SAS',
      location: 'Pereira · Remoto',
      date: 'Mayo 2022 – Presente',
      description: [
        'Desarrollo full stack con Angular, TypeScript, NestJS, Ruby on Rails y PostgreSQL en sistemas para el transporte público, para clientes como Metrolínea, SI18/TransMilenio y Juárez Bus. Ascenso de Junior a Semi Senior en marzo de 2026.',
        '',
        'Sistemas en los que he trabajado:',
        '• MET•PAY: sistema de recaudo para servicios de transporte.',
        '• MET•VOA: sistema de gestión y control de flota.',
        '• VOASI18: sistema de gestión y control de flota a la medida de SI18, operador de TransMilenio, hecho en Ruby on Rails.',
        '• MDS: sistema de mesa de servicios.',
        '• MET•SIU: sistema de información al usuario.',
        '• MET•EOD: sistema de entretenimiento bajo demanda.'
      ].join('\n'),
      company_logo: 'https://www.metgroupsas.com/wp-content/uploads/elementor/thumbs/SIn-Foto-qearrze6pwgdqz5gl12lv6ckoqblim18uwf39d2igk.webp',
      technologies_used: ['Angular', 'TypeScript', 'NestJS', 'Ruby on Rails', 'PostgreSQL']
    },
    {
      title: 'Trainee',
      company: 'iAm Studio SAS',
      location: 'Bogotá · Remoto',
      date: 'Octubre 2021 – Abril 2022',
      description: 'Apoyar en las tareas diarias del equipo, como escribir código, probar software, documentar procesos y colaborar en proyectos; participar en la investigación de nuevas tecnologías y soluciones.',
      company_logo: 'https://iamstudio.co/iam-logo.png',
      technologies_used: ['SenchaJs', 'JavaScript']
    }
  ];
}
