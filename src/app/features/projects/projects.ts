import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IProject } from './interfaces/project.interface';

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
      title: 'Ñapa',
      description: 'Ofertas en Colombia: detecta descuentos inflados, compara tiendas y arma tu mercado',
      tech: ['Angular', 'NestJS', 'MapLibre', 'Playwright'],
      codeLink: 'https://github.com/JFredMC/napa',
      demoLink: 'https://jfredmc.github.io/napa/',
      status: 'completed',
      image: 'projects/napa.webp',
    },
    {
      title: 'Plazo',
      description: 'Simulador de créditos y CDT: cuota, amortización, abonos, retención y 4×1000',
      tech: ['Angular', 'TypeScript', 'Vitest', 'Playwright'],
      codeLink: 'https://github.com/JFredMC/plazo',
      demoLink: 'https://jfredmc.github.io/plazo/',
      status: 'completed',
      image: 'projects/plazo.webp',
    },
    {
      title: 'Velo',
      description: 'Chat privado para parejas: se autodestruye en 24 h, con PIN y fotos protegidas',
      tech: ['Angular', 'NestJS', 'Socket.io', 'Web Push'],
      codeLink: 'https://github.com/JFredMC/jf-chat',
      demoLink: 'https://jfredmc.github.io/jf-chat/demo/',
      status: 'completed',
      image: 'projects/velo.webp',
    },
    {
      title: 'Rumbo',
      description: 'Consola de flota en vivo: buses en el mapa, ETA e incidentes',
      tech: ['Angular', 'MapLibre', 'NestJS', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/rumbo',
      demoLink: 'https://jfredmc.github.io/rumbo/',
      status: 'completed',
      image: 'projects/rumbo.webp',
    },
    {
      title: 'CENTINELA',
      description: 'Detección de fraude en tiempo real con reglas, colas y alertas',
      tech: ['Angular', 'NestJS', 'BullMQ', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/centinela',
      demoLink: 'https://jfredmc.github.io/centinela/',
      status: 'completed',
      image: 'projects/centinela.webp',
    },
    {
      title: 'Point Editor',
      description: 'Mapa interactivo con búsqueda, filtros, medición y GeoJSON/CSV',
      tech: ['Angular', 'MapLibre', 'TypeScript'],
      codeLink: 'https://github.com/JFredMC/point-editor',
      demoLink: 'https://jfredmc.github.io/point-editor/',
      status: 'completed',
      image: 'projects/point-editor.webp',
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
