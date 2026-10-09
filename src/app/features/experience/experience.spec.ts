import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Experience } from './experience';

describe('Experience', () => {
  let fixture: ComponentFixture<Experience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experience],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
  });

  it('shows the MET role, real clients, products, and promotion', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Desarrollador de Software Semi Senior');
    expect(content).toContain('Mayo 2022 – Presente');
    expect(content).toContain('Ascenso de Junior a Semi Senior en marzo de 2026.');
    expect(content).toContain('Metrolínea (Bucaramanga)');
    expect(content).toContain('SI18/TransMilenio (Bogotá)');
    expect(content).toContain('Juárez Bus (Ciudad Juárez, México)');
    expect(content).toContain('MET•PAY');
    expect(content).toContain('MET•VOA');
    expect(content).toContain('MET•MDS');
    expect(content).toContain('MET•SIU');
    expect(content).toContain('MET•EOD');
    expect(content).toContain('primer sistema de recaudo basado en cuentas del país');
  });

  it('shows the iAm Studio internship as the start of the career path', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Practicante Desarrollador de Software');
    expect(content).toContain('iAm Studio');
    expect(content).toContain('Octubre 2021 – Abril 2022');
    expect(content).toContain('crecimiento profesional hasta llegar a Semi Senior en MET GROUP');
  });
});
