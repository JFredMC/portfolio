import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../shared/i18n/i18n.service';
import { TPipe } from '../../shared/i18n/t.pipe';
import { EmailService } from '../../shared/services/email.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TPipe],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly emailService = inject(EmailService);
  private readonly i18n = inject(I18nService);

  readonly subjects = [
    'Consulta general',
    'Proyecto personalizado',
    'Soporte técnico',
    'Partnership',
    'Otro'
  ];

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['Consulta general', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly isSubmitting = signal(false);
  readonly submitMessage = signal('');
  readonly submitSuccess = signal(false);

  private clearTimer?: ReturnType<typeof setTimeout>;

  get f() {
    return this.contactForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.submitMessage.set('');
    this.submitSuccess.set(false);

    const result = await this.emailService.sendContactEmail(this.contactForm.getRawValue());

    this.submitSuccess.set(result.success);
    this.submitMessage.set(result.message);
    this.isSubmitting.set(false);

    if (result.success) {
      this.contactForm.reset({ subject: 'Consulta general' });
      clearTimeout(this.clearTimer);
      this.clearTimer = setTimeout(() => this.submitMessage.set(''), 5000);
    }
  }

  showError(fieldName: 'name' | 'email' | 'message'): boolean {
    const c = this.f[fieldName];
    return c.invalid && c.touched;
  }

  getErrorMessage(fieldName: 'name' | 'email' | 'message'): string {
    const field = this.f[fieldName];
    if (!field.errors || !field.touched) return '';
    const labels = { name: 'Nombre', email: 'Email', message: 'Mensaje' };

    if (field.errors['required']) return this.i18n.t('{field} es requerido', { field: this.i18n.t(labels[fieldName]) });
    if (field.errors['email']) return this.i18n.t('Email no válido');
    if (field.errors['minlength']) return this.i18n.t('Mínimo {min} caracteres', { min: field.errors['minlength'].requiredLength });
    return this.i18n.t('Campo inválido');
  }
}
