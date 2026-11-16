import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecepcionDetallePedido } from './recepcion-detalle-pedido';

describe('RecepcionDetallePedido', () => {
  let component: RecepcionDetallePedido;
  let fixture: ComponentFixture<RecepcionDetallePedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionDetallePedido],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionDetallePedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
