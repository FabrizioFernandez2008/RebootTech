import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarPedido } from './registrar-pedido';

describe('RegistrarPedido', () => {
  let component: RegistrarPedido;
  let fixture: ComponentFixture<RegistrarPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPedido],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
