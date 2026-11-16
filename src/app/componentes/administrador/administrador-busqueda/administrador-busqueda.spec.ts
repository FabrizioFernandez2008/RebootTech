import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorBusqueda } from './administrador-busqueda';

describe('AdministradorBusqueda', () => {
  let component: AdministradorBusqueda;
  let fixture: ComponentFixture<AdministradorBusqueda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorBusqueda],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorBusqueda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
