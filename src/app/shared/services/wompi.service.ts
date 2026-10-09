import { Injectable } from '@angular/core';

export interface WompiDonation {
  amount: number;
  currency: 'COP' | 'USD';
  reference: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class WompiService {
  private readonly PUBLIC_KEY = 'pub_prod_l8v3aNkH3MvmxovBogKpvspBNt8RK4wY';
  private readonly CHECKOUT_LINK = 'https://checkout.wompi.co/l/VPOS_blKLL5';
  private readonly MERCHANT_EMAIL = 'maquiloncordoba@hotmail.com';

  constructor() {}

  /**
   * Abre el checkout de Wompi con monto especificado
   * Wompi permite pasar el monto como parámetro en la URL
   */
  openCheckout(amount: number, currency: 'COP' | 'USD'): void {
    const reference = this.generateReference();
    const description = `Apoyo a JFredDev - ${amount} ${currency}`;

    // Wompi soporta parámetro 'amount' en centavos para COP
    const amountInCents = Math.round(amount * (currency === 'COP' ? 1 : 100));

    // Construir URL del checkout con parámetros
    const checkoutUrl = new URL(this.CHECKOUT_LINK);
    checkoutUrl.searchParams.append('amount', amountInCents.toString());
    checkoutUrl.searchParams.append('reference', reference);
    checkoutUrl.searchParams.append('currency', currency === 'COP' ? 'COP' : 'USD');
    checkoutUrl.searchParams.append('email', this.MERCHANT_EMAIL);

    // Guardar en sessionStorage para tracking post-pago
    sessionStorage.setItem('wompi_donation', JSON.stringify({
      amount,
      currency,
      reference,
      description,
      timestamp: Date.now(),
    }));

    // Log para debugging
    console.log('Wompi Checkout URL:', checkoutUrl.toString());
    console.log('Donation:', { amount, currency, reference });

    // Abrir checkout en nueva ventana
    window.open(checkoutUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  /**
   * Genera una referencia única para el pago
   */
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `JFD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Verifica si hay un pago pendiente de confirmación
   */
  getPendingDonation(): WompiDonation | null {
    const stored = sessionStorage.getItem('wompi_donation');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Limpia el registro de donación pendiente
   */
  clearPendingDonation(): void {
    sessionStorage.removeItem('wompi_donation');
  }

  /**
   * Obtiene la clave pública
   */
  getPublicKey(): string {
    return this.PUBLIC_KEY;
  }

  /**
   * Obtiene el email del comerciante
   */
  getMerchantEmail(): string {
    return this.MERCHANT_EMAIL;
  }
}
