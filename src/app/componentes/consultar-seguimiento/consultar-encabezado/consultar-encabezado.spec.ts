import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarEncabezado } from './consultar-encabezado';

describe('ConsultarEncabezado', () => {
  let component: ConsultarEncabezado;
  let fixture: ComponentFixture<ConsultarEncabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarEncabezado],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarEncabezado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
