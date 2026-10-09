import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly config = environment.emailService;

  async sendContactEmail(formData: ContactFormData): Promise<EmailResult> {
    try {
      await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'maquiloncordoba@hotmail.com'
        },
        { publicKey: this.config.publicKey }
      );
      return {
        success: true,
        message: '¡Mensaje enviado exitosamente! Te responderé pronto.'
      };
    } catch (error) {
      console.error('Error enviando email:', error);
      return {
        success: false,
        message: 'Error al enviar el mensaje. Intenta de nuevo o contacta por WhatsApp.'
      };
    }
  }
}
