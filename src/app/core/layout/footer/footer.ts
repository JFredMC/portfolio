import { ChangeDetectorRef, Component, inject, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TPipe } from '../../../shared/i18n/t.pipe';
import { scrollBehavior, throttle } from '../../../shared/utils/animation.util';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit, AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  date = new Date();

  readonly links = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'support', label: 'Apoya' },
    { id: 'contact', label: 'Contacto' },
  ];
  
  // Estado para saber si estamos "arriba" o no
  isAtTop = true;

  // Umbral en píxeles para considerar "arriba" (ajusta según necesites)
  private readonly TOP_THRESHOLD = 300;

  ngAfterViewInit() {
    // Verificar posición inicial
    this.checkScrollPosition();
  }

  private readonly onWindowScroll = throttle(() => this.checkScrollPosition(), 100);

  ngOnInit() {
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  private checkScrollPosition() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isAtTop = scrollPosition < this.TOP_THRESHOLD;
    this.cdr.markForCheck();
  }

  scrollTo(sectionId: string, event?: Event) {
    event?.preventDefault();
    const element = document.getElementById(sectionId);
    if (!element) return;

    const navbarHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
    const y = element.getBoundingClientRect().top + window.scrollY - (navbarHeight + 16);
    window.scrollTo({ top: y, behavior: scrollBehavior() });
  }

  // Acción del botón
  toggleScroll() {
    if (this.isAtTop) {
      // Estamos arriba → ir abajo (al footer)
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: scrollBehavior()
      });
    } else {
      // Estamos abajo o en medio → ir arriba
      window.scrollTo({
        top: 0,
        behavior: scrollBehavior()
      });
    }
  }
}
