import { Component, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements AfterViewInit {
  date = new Date();

  readonly links = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'projects', label: 'Proyectos' },
  ];
  
  // Estado para saber si estamos "arriba" o no
  isAtTop = true;

  // Umbral en píxeles para considerar "arriba" (ajusta según necesites)
  private readonly TOP_THRESHOLD = 300;

  ngAfterViewInit() {
    // Verificar posición inicial
    this.checkScrollPosition();
  }

  // Escuchar el evento de scroll en toda la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isAtTop = scrollPosition < this.TOP_THRESHOLD;
  }

  scrollTo(sectionId: string, event?: Event) {
    event?.preventDefault();
    const element = document.getElementById(sectionId);
    if (!element) return;

    const navbarHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
    const y = element.getBoundingClientRect().top + window.scrollY - (navbarHeight + 16);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // Acción del botón
  toggleScroll() {
    if (this.isAtTop) {
      // Estamos arriba → ir abajo (al footer)
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // Estamos abajo o en medio → ir arriba
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}