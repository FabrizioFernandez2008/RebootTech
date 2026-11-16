import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecepcionPedidos } from './recepcion-pedidos';

describe('RecepcionPedidos', () => {
  let component: RecepcionPedidos;
  let fixture: ComponentFixture<RecepcionPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionPedidos],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionPedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
