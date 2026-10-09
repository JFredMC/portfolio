import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { EmailService } from '../../shared/services/email.service';

describe('ContactFormComponent', () => {
  const send = jasmine.createSpy('send');

  beforeEach(async () => {
    send.calls.reset();
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [provideZonelessChangeDetection(), { provide: EmailService, useValue: { sendContactEmail: send } }]
    }).compileComponents();
  });

  it('does not submit an invalid form', async () => {
    const c = TestBed.createComponent(ContactFormComponent).componentInstance;
    await c.onSubmit();
    expect(send).not.toHaveBeenCalled();
    expect(c.getErrorMessage('name')).toBe('Nombre es requerido');
  });

  it('submits a valid form and resets it', async () => {
    send.and.resolveTo({ success: true, message: 'ok' });
    const c = TestBed.createComponent(ContactFormComponent).componentInstance;
    c.contactForm.patchValue({ name: 'Ana', email: 'ana@x.co', message: 'Hola, quiero un proyecto' });
    await c.onSubmit();
    expect(send).toHaveBeenCalledTimes(1);
    expect(c.submitSuccess()).toBeTrue();
    expect(c.f.name.value).toBe('');
    expect(c.f.subject.value).toBe('Consulta general');
  });
});
