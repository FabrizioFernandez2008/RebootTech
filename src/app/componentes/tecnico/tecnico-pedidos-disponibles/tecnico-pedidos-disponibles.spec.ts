import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoPedidosDisponibles } from './tecnico-pedidos-disponibles';

describe('TecnicoPedidosDisponibles', () => {
  let component: TecnicoPedidosDisponibles;
  let fixture: ComponentFixture<TecnicoPedidosDisponibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoPedidosDisponibles],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoPedidosDisponibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
