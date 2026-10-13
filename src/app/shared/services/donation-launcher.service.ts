import { Injectable, signal } from '@angular/core';

/** Permite abrir el modal de donación desde cualquier parte (footer, proyectos). */
@Injectable({ providedIn: 'root' })
export class DonationLauncherService {
  readonly requests = signal(0);
  open(): void {
    this.requests.update((n) => n + 1);
  }
}
