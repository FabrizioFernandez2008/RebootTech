import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecepcionBusqueda } from './recepcion-busqueda';

describe('RecepcionBusqueda', () => {
  let component: RecepcionBusqueda;
  let fixture: ComponentFixture<RecepcionBusqueda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionBusqueda],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionBusqueda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
