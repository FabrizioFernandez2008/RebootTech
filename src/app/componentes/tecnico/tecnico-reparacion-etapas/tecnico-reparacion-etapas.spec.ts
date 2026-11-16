import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoReparacionEtapas } from './tecnico-reparacion-etapas';

describe('TecnicoReparacionEtapas', () => {
  let component: TecnicoReparacionEtapas;
  let fixture: ComponentFixture<TecnicoReparacionEtapas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoReparacionEtapas],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoReparacionEtapas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
