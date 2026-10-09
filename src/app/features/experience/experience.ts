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
      title: 'Desarrollador de Software Semi Senior',
      company: 'MET GROUP SAS',
      location: 'Remoto',
      date: 'Mayo 2022 – Presente',
      description: [
        'Diseño, desarrollo y despliegue de sistemas full stack con Angular, NestJS y PostgreSQL para operadores de transporte como Metrolínea (Bucaramanga), SI18 (TransMilenio, Bogotá) y Juárez Bus (Ciudad Juárez, México).',
        'Ascenso de Junior a Semi Senior en marzo de 2026.',
        '',
        'Productos desarrollados:',
        '• MET•PAY — Sistema de Recaudo Abierto Basado en Cuentas: gestiona viajes, recargas y pagos mediante app, QR, NFC, tarjetas o efectivo. Opera en Metrolínea como el primer sistema de recaudo basado en cuentas del país.',
        '• MET•VOA — Gestión y control de flotas: telemetría, rutas, despachos y conteo de pasajeros.',
        '• MET•MDS — Gestión de mantenimiento.',
        '• MET•SIU — Sistema de Información al Usuario.',
        '• MET•EOD — Entretenimiento Bajo Demanda.',
        '',
        'Responsabilidades:',
        '• Análisis de requisitos con clientes de los sectores fintech y transporte.',
        '• Diseño e implementación de APIs RESTful escalables y seguras.',
        '• Desarrollo full stack con Angular, NestJS y Ruby on Rails.',
        '• Pruebas de calidad exhaustivas, documentación técnica y soporte post-deploy.',
        '• Trabajo ágil con Scrum y Kanban en equipos multidisciplinarios.',
        '• Conciliación de recorridos y kilometraje con archivos de TransMilenio para SI18, cargue de vehículos inoperativos, logs de cargue de mantenimientos y control de cambios de tabla.'
      ].join('\n'),
      clients: 'Metrolínea (Bucaramanga), SI18/TransMilenio (Bogotá), Juárez Bus (Ciudad Juárez, México)',
      systems: [
        { name: 'MET•PAY', description: 'Sistema de recaudo abierto basado en cuentas que gestiona viajes, recargas y pagos mediante app, QR, NFC, tarjetas o efectivo. Opera en Metrolínea como el primer sistema de recaudo basado en cuentas del país.' },
        { name: 'MET•VOA', description: 'Sistema de gestión y control de flotas con telemetría, rutas, despachos y conteo de pasajeros.' },
        { name: 'MET•MDS', description: 'Sistema de gestión de mantenimiento para flotas de transporte.' },
        { name: 'MET•SIU', description: 'Sistema de Información al Usuario para operaciones de transporte público.' },
        { name: 'MET•EOD', description: 'Plataforma de Entretenimiento Bajo Demanda para transporte público.' }
      ],
      company_logo: 'https://www.metgroupsas.com/wp-content/uploads/elementor/thumbs/SIn-Foto-qearrze6pwgdqz5gl12lv6ckoqblim18uwf39d2igk.webp',
      technologies_used: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Ruby on Rails', 'APIs REST', 'Scrum', 'Git', 'Testing']
    },
    {
      title: 'Practicante Desarrollador de Software',
      company: 'iAm Studio',
      location: 'Remoto',
      date: 'Octubre 2021 – Abril 2022',
      description: [
        'Participación en el ciclo completo de desarrollo de software:',
        '• Análisis de requisitos y diseño de soluciones.',
        '• Implementación de código limpio y mantenible con buenas prácticas.',
        '• Pruebas de software y documentación de procesos técnicos.',
        '• Investigación e implementación de nuevas tecnologías.',
        '• Colaboración en proyectos multidisciplinarios con metodología ágil.',
        '',
        'Esta experiencia sentó las bases técnicas y de trabajo en equipo para mi crecimiento profesional hasta llegar a Semi Senior en MET GROUP.'
      ].join('\n'),
      clients: '',
      systems: [],
      company_logo: 'https://iamstudio.co/iam-logo.png',
      technologies_used: ['JavaScript', 'SenchaJS', 'Desarrollo web']
    }
  ];
}
