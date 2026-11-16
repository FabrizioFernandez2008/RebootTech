import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorTrabajadores } from './administrador-trabajadores';

describe('AdministradorTrabajadores', () => {
  let component: AdministradorTrabajadores;
  let fixture: ComponentFixture<AdministradorTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorTrabajadores],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorTrabajadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
