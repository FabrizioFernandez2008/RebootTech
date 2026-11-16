import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoReparacionDiagnostico } from './tecnico-reparacion-diagnostico';

describe('TecnicoReparacionDiagnostico', () => {
  let component: TecnicoReparacionDiagnostico;
  let fixture: ComponentFixture<TecnicoReparacionDiagnostico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoReparacionDiagnostico],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoReparacionDiagnostico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
