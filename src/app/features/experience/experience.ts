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
      location: 'Pereira · remoto',
      date: 'Mayo 2022 – presente',
      description: 'Ascenso de Junior a Semi Senior en marzo de 2026.',
      clients: 'Metrolínea, SI18/TransMilenio y Juárez Bus',
      systems: [
        { name: 'MET•PAY', description: 'Recaudo del servicio de transporte: el dinero del viaje tiene que cuadrar desde la validación hasta el cierre.' },
        { name: 'MET•VOA', description: 'Gestión y control de flota. Lo que pasa en la calle tiene que verse en el sistema, no en una hoja aparte.' },
        { name: 'VOASI18', description: 'Flota a la medida de SI18, operador de TransMilenio. Hecho en Ruby on Rails, no en una plantilla genérica.' },
        { name: 'MDS', description: 'Mesa de servicios. El incidente de operación llega, se asigna y se cierra con trazabilidad.' },
        { name: 'MET•SIU', description: 'Información al usuario. Lo que el pasajero ve tiene que salir del mismo sistema que opera la flota.' },
        { name: 'MET•EOD', description: 'Entretenimiento bajo demanda. Otro canal del mismo ecosistema, no un proyecto aislado.' }
      ],
      company_logo: 'https://www.metgroupsas.com/wp-content/uploads/elementor/thumbs/SIn-Foto-qearrze6pwgdqz5gl12lv6ckoqblim18uwf39d2igk.webp',
      technologies_used: ['Angular', 'TypeScript', 'NestJS', 'Ruby on Rails', 'PostgreSQL']
    },
    {
      title: 'Trainee',
      company: 'iAm Studio SAS',
      location: 'Bogotá · remoto',
      date: 'Octubre 2021 – abril 2022',
      description: 'Código, pruebas, documentación e investigación de tecnologías con el equipo.',
      company_logo: 'https://iamstudio.co/iam-logo.png',
      technologies_used: ['SenchaJs', 'JavaScript']
    }
  ];
}
