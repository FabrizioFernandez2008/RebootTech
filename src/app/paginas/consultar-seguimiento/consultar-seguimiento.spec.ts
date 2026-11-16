import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarSeguimiento } from './consultar-seguimiento';

describe('ConsultarSeguimiento', () => {
  let component: ConsultarSeguimiento;
  let fixture: ComponentFixture<ConsultarSeguimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarSeguimiento],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarSeguimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
