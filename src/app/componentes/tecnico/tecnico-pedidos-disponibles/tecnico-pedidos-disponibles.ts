import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';
import { Reparaciones } from '../../../servicios/reparaciones';

@Component({
  selector: 'app-tecnico-pedidos-disponibles',
  imports: [],
  templateUrl: './tecnico-pedidos-disponibles.html',
  styleUrl: './tecnico-pedidos-disponibles.css',
})
export class TecnicoPedidosDisponibles {

  private reparaciones = inject(Reparaciones);

  @Input() pedidos: Reparacion[] = [];
  @Input() puedeAsignar = false;

  @Output() asignar = new EventEmitter<Reparacion>();

  pedidoSeleccionado = signal<Reparacion | null>(null);

  clienteSeleccionado = signal<Cliente | null>(null);

  verDetalles(pedido: Reparacion) {
    this.pedidoSeleccionado.set(pedido);
    this.clienteSeleccionado.set(null);

    this.reparaciones.buscarClientePorDni(
      pedido.dniCliente
    ).subscribe(cliente => {
      if (
        this.pedidoSeleccionado()?.codigoAtencion === pedido.codigoAtencion
      ) {
        this.clienteSeleccionado.set(cliente);
      }
    });
  }

  cerrarDetalles() {
    this.pedidoSeleccionado.set(null);
    this.clienteSeleccionado.set(null);
  }

  confirmarAsignacion() {
    const pedido = this.pedidoSeleccionado();

    if (!pedido || !this.puedeAsignar) return;

    this.asignar.emit(pedido);
    this.cerrarDetalles();
  }
}
