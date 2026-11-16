import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RecepcionEncabezado } from '../../componentes/recepcion/recepcion-encabezado/recepcion-encabezado';
import { RegistroCliente } from '../../componentes/recepcion/registro-cliente/registro-cliente';
import { RegistroReparacion } from '../../componentes/recepcion/registro-reparacion/registro-reparacion';
import { Footer } from '../../componentes/footer/footer';
import { Cliente } from '../../modelos/clientes';
import { Reparacion, DatosReparacion } from '../../modelos/reparaciones';
import { Reparaciones } from '../../servicios/reparaciones';

@Component({
  selector: 'app-registrar-pedido',
  imports: [
    RecepcionEncabezado,
    RegistroCliente,
    RegistroReparacion,
    Footer
  ],
  templateUrl: './registrar-pedido.html',
  styleUrl: './registrar-pedido.css',
})
export class RegistrarPedido {

  private reparaciones = inject(Reparaciones);
  private router = inject(Router);

  clienteSeleccionado = signal<Cliente | null>(null);
  pedidoRegistrado = signal<Reparacion | null>(null);

  seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado.set(cliente);
    this.pedidoRegistrado.set(null);
  }

  limpiarClienteSeleccionado(): void {
    this.clienteSeleccionado.set(null);
    this.pedidoRegistrado.set(null);
  }

  guardarReparacion(datosReparacion: DatosReparacion): void {
    const cliente = this.clienteSeleccionado();

    if (!cliente) return;

    this.reparaciones.registrarReparacion(
      datosReparacion,
      cliente.dni
    ).subscribe({
      next: nuevaReparacion => {
        this.pedidoRegistrado.set(nuevaReparacion);
      }
    });
  }

  volverARecepcion(): void {
    this.router.navigate(['/recepcion']);
  }
}
