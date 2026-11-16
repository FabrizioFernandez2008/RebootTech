import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarBusqueda } from './consultar-busqueda';

describe('ConsultarBusqueda', () => {
  let component: ConsultarBusqueda;
  let fixture: ComponentFixture<ConsultarBusqueda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarBusqueda],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarBusqueda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
