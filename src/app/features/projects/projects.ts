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
    },
    {
      title: 'Billetera Digital',
      description: 'Billetera digital con libro contable de doble partida y transferencias idempotentes',
      tech: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
      codeLink: 'https://github.com/JFredMC/digital-wallet-ledger',
      demoLink: 'https://jfredmc.github.io/digital-wallet-ledger/',
      status: 'completed',
      image: 'projects/digital-wallet-ledger.png',
    },
    {
      title: 'Pasarela de Pagos',
      description: 'Pasarela de pagos simulada: checkout con 3DS, PSE y Nequi, reembolsos y webhooks',
      tech: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
      codeLink: 'https://github.com/JFredMC/payment-gateway-sim',
      demoLink: 'https://jfredmc.github.io/payment-gateway-sim/',
      status: 'completed',
      image: 'projects/payment-gateway-sim.png',
    }
  ];
}
