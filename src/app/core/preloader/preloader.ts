import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-gray-950 to-purple-950 
             transition-opacity duration-800 ease-out"
      [ngClass]="{
        'opacity-0 pointer-events-none': !visible()
      }"
    >
      <div class="text-center space-y-8">
        <!-- Logo / Nombre con animación -->
        <div class="relative">
          <h1 class="text-6xl md:text-8xl font-display font-extrabold tracking-tight 
                     bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent 
                     animate-pulse-slow">
            JFredDev
          </h1>
          <!-- Efecto de "reveal" o brillo -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      animate-shimmer rounded-lg blur-xl opacity-70"></div>
        </div>

        <!-- Spinner sutil moderno -->
        <div class="flex justify-center">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-4 border-indigo-400/30 animate-ping"></div>
            <div class="absolute inset-2 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
        </div>

        <p class="text-gray-400 text-lg animate-pulse">
          Cargando experiencia...
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class Preloader {
  visible = signal(true);

  hide() {
    this.visible.set(false);
  }
}