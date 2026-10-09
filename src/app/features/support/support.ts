import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { WompiService } from '../../shared/services/wompi.service';

type DonationMethod = {
  id: string;
  title: string;
  description: string;
  badge: string;
  currency: 'COP' | 'USD';
  accent: string;
  recommended?: boolean;
  amountOptions: number[];
  isAvailable: boolean;
};

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support {
  wompiService = inject(WompiService);
  @ViewChild('donationDialog') donationDialog?: ElementRef<HTMLDivElement>;

  readonly methods: DonationMethod[] = [
    {
      id: 'wompi',
      title: 'Wompi',
      description: 'La mejor opción para apoyar desde Colombia con pagos locales y transferencias seguras.',
      badge: '🇨🇴',
      currency: 'COP',
      accent: 'from-amber-400 to-yellow-500',
      recommended: true,
      amountOptions: [10000, 25000, 50000, 100000],
      isAvailable: true,
    },
  ];

  readonly note = 'Tu aporte ayuda a mantener y seguir desarrollando proyectos personales. El pago se procesa en Wompi; este portafolio no puede confirmar el resultado de la transacción.';

  selectedMethodId = 'wompi';
  selectedAmount = 25000;
  customAmount = '';
  amountError = '';
  showModal = false;
  isProcessing = false;
  private donationTrigger: HTMLElement | null = null;

  get selectedMethod(): DonationMethod {
    return this.methods.find((method) => method.id === this.selectedMethodId) ?? this.methods[0];
  }

  openDonationModal(methodId: string): void {
    this.selectedMethodId = methodId;
    const method = this.selectedMethod;
    this.selectedAmount = method.amountOptions[1] ?? 0;
    this.customAmount = '';
    this.amountError = '';
    this.donationTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.showModal = true;
    setTimeout(() => this.donationDialog?.nativeElement.focus());
  }

  closeDonationModal(): void {
    this.showModal = false;
    this.customAmount = '';
    this.amountError = '';
    const trigger = this.donationTrigger;
    this.donationTrigger = null;
    setTimeout(() => trigger?.focus());
  }

  @HostListener('document:keydown', ['$event'])
  handleDialogKeydown(event: KeyboardEvent): void {
    if (!this.showModal) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDonationModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = this.donationDialog?.nativeElement;
    if (!dialog) return;

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      event.preventDefault();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  selectMethod(methodId: string): void {
    this.selectedMethodId = methodId;
    const method = this.selectedMethod;
    this.selectedAmount = method.amountOptions[1] ?? 0;
    this.customAmount = '';
  }

  setPresetAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = '';
    this.amountError = '';
  }

  applyCustomAmount(): void {
    const parsed = Number(this.customAmount);
    const minimum = this.selectedMethod.currency === 'COP' ? 1000 : 1;
    if (!Number.isInteger(parsed) || parsed < minimum) {
      this.amountError = `Ingresa un monto entero de al menos ${minimum.toLocaleString('es-CO')} ${this.selectedMethod.currency}.`;
      return;
    }

    this.selectedAmount = Math.round(parsed);
    this.amountError = '';
  }

  donate(): void {
    const method = this.selectedMethod;

    const minimum = method.currency === 'COP' ? 1000 : 1;
    if (!method.isAvailable || !Number.isInteger(this.selectedAmount) || this.selectedAmount < minimum) {
      return;
    }

    this.isProcessing = true;

    this.wompiService.openCheckout(this.selectedAmount, method.currency);
    this.closeDonationModal();
    this.isProcessing = false;
  }
}
