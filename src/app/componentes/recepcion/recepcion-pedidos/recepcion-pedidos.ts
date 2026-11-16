import { Component, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecepcionBusqueda } from '../recepcion-busqueda/recepcion-busqueda';
import { RecepcionDetallePedido } from '../recepcion-detalle-pedido/recepcion-detalle-pedido';
import { Reparaciones, PedidoConCliente } from '../../../servicios/reparaciones';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-recepcion-pedidos',
  imports: [
    NgClass,
    RouterLink,
    RecepcionBusqueda,
    RecepcionDetallePedido
  ],
  templateUrl: './recepcion-pedidos.html',
  styleUrl: './recepcion-pedidos.css',
})
export class RecepcionPedidos {

  private reparaciones = inject(Reparaciones);

  pedidoSeleccionado = signal<Reparacion | null>(null);
  clienteSeleccionado = signal<Cliente | null>(null);

  criterioBusqueda = signal('codigo');
  textoBusqueda = signal('');

  pedidos = signal<PedidoConCliente[]>([]);

  constructor() {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.reparaciones.buscarPedidos(
      this.criterioBusqueda(),
      this.textoBusqueda()
    ).subscribe({
      next: pedidos => {
        this.pedidos.set(pedidos);
      }
    });
  }

  buscarPedidos(criterio: string, busqueda: string): void {
    this.criterioBusqueda.set(criterio);
    this.textoBusqueda.set(busqueda);
    this.cargarPedidos();
  }

  limpiarBusqueda(): void {
    this.criterioBusqueda.set('codigo');
    this.textoBusqueda.set('');
    this.cargarPedidos();
  }

  seleccionarPedido(pedido: Reparacion): void {
    this.pedidoSeleccionado.set(pedido);
    this.clienteSeleccionado.set(null);

    this.reparaciones.buscarClientePorDni(pedido.dniCliente)
      .subscribe({
        next: cliente => {
          this.clienteSeleccionado.set(cliente);
        }
      });
  }

  cerrarDetallePedido(): void {
    this.pedidoSeleccionado.set(null);
    this.clienteSeleccionado.set(null);
  }

  confirmarReparacion(): void {
    const pedido = this.pedidoSeleccionado();

    if (!pedido) return;

    this.reparaciones.confirmarReparacion(
      pedido.codigoAtencion
    ).subscribe({
      next: pedidoActualizado => {
        if (!pedidoActualizado) return;

        this.pedidoSeleccionado.set(pedidoActualizado);
        this.cargarPedidos();
      }
    });
  }

  terminarReparacion(): void {
    const pedido = this.pedidoSeleccionado();

    if (!pedido) return;

    this.reparaciones.terminarReparacion(
      pedido.codigoAtencion
    ).subscribe({
      next: pedidoActualizado => {
        if (!pedidoActualizado) return;

        this.pedidoSeleccionado.set(pedidoActualizado);
        this.cargarPedidos();
      }
    });
  }
}
