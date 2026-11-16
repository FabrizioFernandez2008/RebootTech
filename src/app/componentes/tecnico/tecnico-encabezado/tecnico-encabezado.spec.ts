import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoEncabezado } from './tecnico-encabezado';

describe('TecnicoEncabezado', () => {
  let component: TecnicoEncabezado;
  let fixture: ComponentFixture<TecnicoEncabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoEncabezado],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoEncabezado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
