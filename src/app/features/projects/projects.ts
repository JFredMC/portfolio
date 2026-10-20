import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImageOptimized } from '../../shared/components/image-optimized';
import { TPipe } from '../../shared/i18n/t.pipe';
import { ThemeService } from '../../shared/services/theme.service';
import { IProject } from './interfaces/project.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  imports: [CommonModule, ImageOptimized, TPipe],
})
export class Projects {
  private readonly theme = inject(ThemeService);

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
      demoLink: 'https://napaofertas.com/',
      status: 'completed',
      image: 'projects/napa-light.webp',
      imageDark: 'projects/napa-dark.webp',
    },
    {
      title: 'Plazo',
      description: 'Simulador de créditos y CDT: cuota, amortización, abonos, retención y 4×1000',
      tech: ['Angular', 'TypeScript', 'Vitest', 'Playwright'],
      codeLink: 'https://github.com/JFredMC/plazo',
      demoLink: 'https://jfredmc.github.io/plazo/',
      status: 'completed',
      image: 'projects/plazo-light.webp',
      imageDark: 'projects/plazo-dark.webp',
    },
    {
      title: 'Velo',
      description: 'Chat privado para parejas: se autodestruye en 24 h, con PIN y fotos protegidas',
      tech: ['Angular', 'NestJS', 'Socket.io', 'Web Push'],
      codeLink: 'https://github.com/JFredMC/jf-chat',
      demoLink: 'https://jfredmc.github.io/jf-chat/demo/',
      status: 'completed',
      image: 'projects/velo-light.webp',
      imageDark: 'projects/velo-dark.webp',
    },
    {
      title: 'Rumbo',
      description: 'Consola de flota en vivo: buses en el mapa, ETA e incidentes',
      tech: ['Angular', 'MapLibre', 'NestJS', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/rumbo',
      demoLink: 'https://jfredmc.github.io/rumbo/',
      status: 'completed',
      image: 'projects/rumbo-light.webp',
      imageDark: 'projects/rumbo-dark.webp',
    },
    {
      title: 'CENTINELA',
      description: 'Detección de fraude en tiempo real con reglas, colas y alertas',
      tech: ['Angular', 'NestJS', 'BullMQ', 'Socket.io'],
      codeLink: 'https://github.com/JFredMC/centinela',
      demoLink: 'https://jfredmc.github.io/centinela/',
      status: 'completed',
      image: 'projects/centinela-light.webp',
      imageDark: 'projects/centinela-dark.webp',
    },
    {
      title: 'Point Editor',
      description: 'Mapa interactivo con búsqueda, filtros, medición y GeoJSON/CSV',
      tech: ['Angular', 'MapLibre', 'TypeScript'],
      codeLink: 'https://github.com/JFredMC/point-editor',
      demoLink: 'https://jfredmc.github.io/point-editor/',
      status: 'completed',
      image: 'projects/point-editor-light.webp',
      imageDark: 'projects/point-editor-dark.webp',
    },
    {
      title: 'Billetera Digital',
      description: 'Billetera digital con libro contable de doble partida y transferencias idempotentes',
      tech: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
      codeLink: 'https://github.com/JFredMC/digital-wallet-ledger',
      demoLink: 'https://jfredmc.github.io/digital-wallet-ledger/',
      status: 'completed',
      image: 'projects/digital-wallet-ledger-light.webp',
      imageDark: 'projects/digital-wallet-ledger-dark.webp',
      featured: true,
    },
    {
      title: 'Pasarela de Pagos',
      description: 'Pasarela de pagos simulada: checkout con 3DS, PSE y Nequi, reembolsos y webhooks',
      tech: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
      codeLink: 'https://github.com/JFredMC/payment-gateway-sim',
      demoLink: 'https://jfredmc.github.io/payment-gateway-sim/',
      status: 'completed',
      image: 'projects/payment-gateway-sim-light.webp',
      imageDark: 'projects/payment-gateway-sim-dark.webp',
      featured: true,
    }
  ];

  readonly featuredProjects = this.projects.filter((project) => project.featured);
  readonly otherProjects = this.projects.filter((project) => !project.featured);

  /** Captura acorde al tema actual; cambia al alternar el modo sin recargar. */
  imageFor(project: IProject): string {
    const image = project.image ?? '';
    return this.theme.darkMode() && project.imageDark ? project.imageDark : image;
  }

  statusLabel(status: IProject['status']): string {
    return this.statusLabels[status];
  }
}
