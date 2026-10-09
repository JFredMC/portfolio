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
      description: 'Desarrollador Full Stack en productos de movilidad con Angular, TypeScript, NestJS y Ruby on Rails. Ascenso de Junior a Semi Senior en marzo de 2026.',
      clients: 'Operadores de transporte público',
      systems: [
        { name: 'Recaudo', description: 'Soluciones para registrar y gestionar pagos asociados al servicio de transporte.' },
        { name: 'Gestión de flota', description: 'Herramientas para consultar y administrar información de operación vehicular.' },
        { name: 'Operación de flota', description: 'Desarrollo de soluciones de gestión de flota con Ruby on Rails.' },
        { name: 'Mesa de servicios', description: 'Herramientas para organizar y dar seguimiento a solicitudes e incidentes operativos.' },
        { name: 'Información al usuario', description: 'Soluciones digitales para consultar información del servicio de transporte.' },
        { name: 'Contenido a bordo', description: 'Funcionalidades digitales de entretenimiento para pasajeros.' }
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
