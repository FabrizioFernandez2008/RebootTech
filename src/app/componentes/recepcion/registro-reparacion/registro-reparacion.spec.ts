import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroReparacion } from './registro-reparacion';

describe('RegistroReparacion', () => {
  let component: RegistroReparacion;
  let fixture: ComponentFixture<RegistroReparacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroReparacion],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroReparacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
