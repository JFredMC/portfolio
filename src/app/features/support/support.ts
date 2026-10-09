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
      description: 'La mejor opción para apoyar desde Colombia con pagos locales y transferencia segura.',
      badge: '🇨🇴',
      currency: 'COP',
      link: 'https://www.wompi.co/',
      accent: 'from-amber-400 to-yellow-500',
    },
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Ideal para donaciones internacionales con tarjeta y pagos globales.',
      badge: '🌍',
      currency: 'USD',
      link: 'https://checkout.stripe.com/',
      accent: 'from-cyan-400 to-indigo-500',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Alternativa rápida para personas fuera de Colombia o que prefieren PayPal.',
      badge: '💳',
      currency: 'USD',
      link: 'https://www.paypal.com/donate',
      accent: 'from-blue-500 to-indigo-600',
    },
  ];

  readonly note = 'Recomendación: usa Wompi para Colombia y Stripe para donar desde fuera del país.';

  openDonation(method: DonationMethod): void {
    window.open(method.link, '_blank', 'noopener,noreferrer');
  }
}
