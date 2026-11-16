import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoReparacionFormulario } from './tecnico-reparacion-formulario';

describe('TecnicoReparacionFormulario', () => {
  let component: TecnicoReparacionFormulario;
  let fixture: ComponentFixture<TecnicoReparacionFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoReparacionFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoReparacionFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
