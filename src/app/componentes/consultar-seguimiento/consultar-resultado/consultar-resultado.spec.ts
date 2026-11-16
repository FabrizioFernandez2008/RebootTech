import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarResultado } from './consultar-resultado';

describe('ConsultarResultado', () => {
  let component: ConsultarResultado;
  let fixture: ComponentFixture<ConsultarResultado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarResultado],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarResultado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
