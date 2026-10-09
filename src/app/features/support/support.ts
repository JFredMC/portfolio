import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
export class Support implements OnInit, OnDestroy {
  private wompiService = inject(WompiService);

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
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Ideal para donaciones internacionales con tarjeta de crédito y pagos globales.',
      badge: '🌍',
      currency: 'USD',
      accent: 'from-cyan-400 to-indigo-500',
      amountOptions: [5, 10, 25, 50],
      isAvailable: false,
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Alternativa rápida para quienes prefieren PayPal o están fuera de Colombia.',
      badge: '💳',
      currency: 'USD',
      accent: 'from-blue-500 to-indigo-600',
      amountOptions: [5, 10, 25, 50],
      isAvailable: false,
    },
  ];

  readonly note = 'Wompi está activo. Stripe y PayPal se configurarán próximamente.';

  selectedMethodId = 'wompi';
  selectedAmount = 25000;
  customAmount = '';
  showModal = false;
  showThankYouModal = false;
  isProcessing = false;

  get selectedMethod(): DonationMethod {
    return this.methods.find((method) => method.id === this.selectedMethodId) ?? this.methods[0];
  }

  ngOnInit(): void {
    const pending = this.wompiService.getPendingDonation();
    if (pending) {
      setTimeout(() => {
        this.showThankYouModal = true;
        this.wompiService.clearPendingDonation();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.wompiService.clearPendingDonation();
  }

  openDonationModal(methodId: string): void {
    this.selectedMethodId = methodId;
    const method = this.selectedMethod;
    this.selectedAmount = method.amountOptions[1] ?? 0;
    this.customAmount = '';
    this.showModal = true;
  }

  closeDonationModal(): void {
    this.showModal = false;
    this.customAmount = '';
  }

  closeThankYouModal(): void {
    this.showThankYouModal = false;
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
  }

  applyCustomAmount(): void {
    const parsed = Number(this.customAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      this.customAmount = '';
      return;
    }

    this.selectedAmount = Math.round(parsed);
  }

  donate(): void {
    const method = this.selectedMethod;

    if (!method.isAvailable) {
      alert(`${method.title} aún no está disponible. Por favor, usa Wompi o contáctame por WhatsApp.`);
      return;
    }

    this.isProcessing = true;

    if (method.id === 'wompi') {
      this.wompiService.openCheckout(this.selectedAmount, method.currency);
      setTimeout(() => {
        this.closeDonationModal();
        this.isProcessing = false;
      }, 500);
    } else {
      const amountLabel =
        method.currency === 'COP'
          ? `${this.selectedAmount.toLocaleString('es-CO')} COP`
          : `$${this.selectedAmount} USD`;
      const message = encodeURIComponent(
        `Hola Jhon, quiero apoyar a JFredDev con ${amountLabel} via ${method.title}.`
      );

      window.open(`https://wa.me/573106643807?text=${message}`, '_blank', 'noopener,noreferrer');
      this.closeDonationModal();
      this.isProcessing = false;
    }
  }
}
