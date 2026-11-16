import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicoPedidosAsignados } from './tecnico-pedidos-asignados';

describe('TecnicoPedidosAsignados', () => {
  let component: TecnicoPedidosAsignados;
  let fixture: ComponentFixture<TecnicoPedidosAsignados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoPedidosAsignados],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoPedidosAsignados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
