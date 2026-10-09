import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../shared/services/email.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly emailService = inject(EmailService);

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

    if (field.errors['required']) return `${labels[fieldName]} es requerido`;
    if (field.errors['email']) return 'Email no válido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }
}
