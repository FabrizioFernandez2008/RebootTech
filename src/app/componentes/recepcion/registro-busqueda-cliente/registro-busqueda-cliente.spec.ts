import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroBusquedaCliente } from './registro-busqueda-cliente';

describe('RegistroBusquedaCliente', () => {
  let component: RegistroBusquedaCliente;
  let fixture: ComponentFixture<RegistroBusquedaCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroBusquedaCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroBusquedaCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
