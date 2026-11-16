import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoReparacion } from './tecnico-reparacion';

describe('TecnicoReparacion', () => {
  let component: TecnicoReparacion;
  let fixture: ComponentFixture<TecnicoReparacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoReparacion],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoReparacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
