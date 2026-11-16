import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorEncabezado } from './administrador-encabezado';

describe('AdministradorEncabezado', () => {
  let component: AdministradorEncabezado;
  let fixture: ComponentFixture<AdministradorEncabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorEncabezado],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorEncabezado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
