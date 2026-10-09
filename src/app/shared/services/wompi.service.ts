import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WompiService {
  private readonly CHECKOUT_LINK = 'https://checkout.wompi.co/l/VPOS_blKLL5';
  private readonly MERCHANT_EMAIL = 'maquiloncordoba@hotmail.com';

  openCheckout(amount: number, currency: 'COP' | 'USD'): void {
    const reference = this.generateReference();
    const amountInCents = Math.round(amount * (currency === 'COP' ? 1 : 100));
    const checkoutUrl = new URL(this.CHECKOUT_LINK);
    checkoutUrl.searchParams.append('amount', amountInCents.toString());
    checkoutUrl.searchParams.append('reference', reference);
    checkoutUrl.searchParams.append('currency', currency);
    checkoutUrl.searchParams.append('email', this.MERCHANT_EMAIL);

    window.open(checkoutUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `JFD-${timestamp}-${random}`.toUpperCase();
  }

}
