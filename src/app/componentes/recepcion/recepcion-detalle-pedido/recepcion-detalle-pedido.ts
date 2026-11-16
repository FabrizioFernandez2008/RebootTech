import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-recepcion-detalle-pedido',
  imports: [],
  templateUrl: './recepcion-detalle-pedido.html',
  styleUrl: './recepcion-detalle-pedido.css',
})
export class RecepcionDetallePedido {

  @Input() pedido: Reparacion | null = null;
  @Input() cliente: Cliente | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() cambiarEstado = new EventEmitter<void>();
  @Output() terminar = new EventEmitter<void>();

}

