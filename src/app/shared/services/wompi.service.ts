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
   */
  openCheckout(amount: number, currency: 'COP' | 'USD'): void {
    const amountInCents = Math.round(amount * 100);
    const reference = this.generateReference();
    const description = `Apoyo a JFredDev - ${amount} ${currency}`;

    // Construir URL de pago con parámetros
    const checkoutUrl = new URL(this.CHECKOUT_LINK);
    checkoutUrl.searchParams.append('amount', amountInCents.toString());
    checkoutUrl.searchParams.append('reference', reference);
    checkoutUrl.searchParams.append('currency', currency);

    // Guardar en sessionStorage para tracking
    sessionStorage.setItem('wompi_donation', JSON.stringify({ amount, currency, reference, description }));

    // Abrir en nueva ventana
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
   * Verifica el estado de un pago (opcional, requiere backend)
   */
  async checkPaymentStatus(reference: string): Promise<any> {
    // Esto es opcional y requeriría un backend para consultar la API de Wompi
    console.log(`Verificando pago: ${reference}`);
  }

  /**
   * Obtiene la clave pública para cliente
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
