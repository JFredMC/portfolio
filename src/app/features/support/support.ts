import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type DonationMethod = {
  id: string;
  title: string;
  description: string;
  badge: string;
  currency: 'COP' | 'USD';
  link: string;
  accent: string;
  recommended?: boolean;
  amountOptions: number[];
};

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
})
export class Support {
  readonly methods: DonationMethod[] = [
    {
      id: 'wompi',
      title: 'Wompi',
      description: 'La mejor opción para apoyar desde Colombia con pagos locales y transferencias seguras.',
      badge: '🇨🇴',
      currency: 'COP',
      link: 'https://www.wompi.co/',
      accent: 'from-amber-400 to-yellow-500',
      recommended: true,
      amountOptions: [10000, 25000, 50000, 100000],
    },
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Ideal para donaciones internacionales con tarjeta de crédito y pagos globales.',
      badge: '🌍',
      currency: 'USD',
      link: 'https://donate.stripe.com/',
      accent: 'from-cyan-400 to-indigo-500',
      amountOptions: [5, 10, 25, 50],
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Alternativa rápida para quienes prefieren PayPal o están fuera de Colombia.',
      badge: '💳',
      currency: 'USD',
      link: 'https://www.paypal.com/donate',
      accent: 'from-blue-500 to-indigo-600',
      amountOptions: [5, 10, 25, 50],
    },
  ];

  readonly note = 'Recomendación: usa Wompi para Colombia y Stripe para apoyar desde fuera del país.';

  selectedMethodId = 'wompi';
  selectedAmount = 25000;
  customAmount = '';

  get selectedMethod(): DonationMethod {
    return this.methods.find((method) => method.id === this.selectedMethodId) ?? this.methods[0];
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
    const amount = this.selectedAmount;
    const amountLabel = method.currency === 'COP' ? `${amount.toLocaleString('es-CO')} COP` : `$${amount} USD`;
    const message = encodeURIComponent(`Hola, quiero apoyar a JFredDev con ${amountLabel} via ${method.title}.`);

    const baseUrl = method.link;
    const donationUrl =
      method.id === 'paypal'
        ? `${baseUrl}?amount=${amount}&currency=USD&no_shipping=1`
        : method.id === 'stripe'
          ? `${baseUrl}?amount=${amount}`
          : `${baseUrl}?amount=${amount}`;

    const fallbackUrl = `https://wa.me/573106643807?text=${message}`;
    window.open(donationUrl, '_blank', 'noopener,noreferrer');

    if (baseUrl.includes('donate') || baseUrl.includes('stripe.com')) {
      setTimeout(() => {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }, 250);
    }
  }
}
