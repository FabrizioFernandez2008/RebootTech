import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoReparacionRepuestos } from './tecnico-reparacion-repuestos';

describe('TecnicoReparacionRepuestos', () => {
  let component: TecnicoReparacionRepuestos;
  let fixture: ComponentFixture<TecnicoReparacionRepuestos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoReparacionRepuestos],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoReparacionRepuestos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
