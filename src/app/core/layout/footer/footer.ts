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