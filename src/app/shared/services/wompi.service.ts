import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface WompiSignature {
  reference: string;
  amountInCents: number;
  currency: 'COP';
  signature: string;
}

@Injectable({
  providedIn: 'root',
})
export class WompiService {
  /** Enlace de monto abierto: respaldo si la firma falla. */
  readonly FALLBACK_LINK = 'https://checkout.wompi.co/l/VPOS_blKLL5';
  readonly CHECKOUT_URL = 'https://checkout.wompi.co/p/';
  /** Render (plan gratuito) puede tardar en despertar. */
  timeoutMs = 25_000;

  /**
   * Abre una pestaña en blanco dentro del clic (para que no la bloqueen), pide la firma a la API
   * de Ñapa y lleva esa pestaña al Web Checkout con el monto fijo. Si algo falla, usa el enlace abierto.
   */
  async openCheckout(amount: number, currency: 'COP' | 'USD'): Promise<void> {
    const tab = window.open('', '_blank');
    let url = this.FALLBACK_LINK;
    if (currency === 'COP') {
      try {
        const signed = await this.sign(amount);
        url = this.buildCheckoutUrl(signed);
      } catch {
        url = this.FALLBACK_LINK;
      }
    }
    if (tab && !tab.closed) {
      try {
        tab.opener = null;
      } catch {
        /* ignorado */
      }
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  }

  buildCheckoutUrl(s: WompiSignature): string {
    const params = [
      ['public-key', environment.wompi.publicKey],
      ['currency', s.currency],
      ['amount-in-cents', String(s.amountInCents)],
      ['reference', s.reference],
      ['signature:integrity', s.signature],
      ['redirect-url', environment.wompi.redirectUrl],
    ];
    return `${this.CHECKOUT_URL}?${params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}`;
  }

  private async sign(amount: number): Promise<WompiSignature> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(environment.wompi.signatureUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as WompiSignature;
      if (!data?.signature || data.amountInCents !== amount * 100) throw new Error('Firma inválida');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }
}
