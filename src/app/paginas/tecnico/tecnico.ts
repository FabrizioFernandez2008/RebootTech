import { Component, computed, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Autenticacion } from '../../servicios/autenticacion';
import { Reparaciones } from '../../servicios/reparaciones';
import { Reparacion } from '../../modelos/reparaciones';
import { TecnicoPedidosDisponibles } from '../../componentes/tecnico/tecnico-pedidos-disponibles/tecnico-pedidos-disponibles';
import { TecnicoPedidosAsignados } from '../../componentes/tecnico/tecnico-pedidos-asignados/tecnico-pedidos-asignados';
import { TecnicoEncabezado } from '../../componentes/tecnico/tecnico-encabezado/tecnico-encabezado';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-tecnico',
  imports: [
    TecnicoEncabezado,
    TecnicoPedidosDisponibles,
    TecnicoPedidosAsignados,
    Footer
  ],
  templateUrl: './tecnico.html',
  styleUrl: './tecnico.css',
})
export class Tecnico {
  private reparaciones = inject(Reparaciones);
  private autenticacion = inject(Autenticacion);
  private router = inject(Router);

  dniTecnico = computed(() =>
    this.autenticacion.usuarioActual()?.dni ?? null
  );

  pedidosDisponibles = signal<Reparacion[]>([]);
  pedidosAsignados = signal<Reparacion[]>([]);
  tieneReparacionActiva = signal(false);

  cargandoPedido = signal(false);
  codigoPedidoCargando = signal<string | null>(null);
  mensajeError = signal('');

  constructor() {
    effect(onCleanup => {
      const dni = this.dniTecnico();

      if (!dni) {
        this.limpiarPedidos();
        return;
      }

      const suscripciones = [
        this.reparaciones.obtenerPedidosDisponibles().subscribe(pedidos => {
          this.pedidosDisponibles.set(pedidos);
        }),
        this.reparaciones.obtenerPedidosAsignados(dni).subscribe(pedidos => {
          this.pedidosAsignados.set(pedidos);
        }),
        this.reparaciones.tieneReparacionActiva(dni).subscribe(activa => {
          this.tieneReparacionActiva.set(activa);
        })
      ];

      onCleanup(() => {
        suscripciones.forEach(suscripcion => suscripcion.unsubscribe());
      });
    });
  }

  private limpiarPedidos(): void {
    this.pedidosDisponibles.set([]);
    this.pedidosAsignados.set([]);
    this.tieneReparacionActiva.set(false);
  }

  private actualizarPedidos(): void {
    const dni = this.dniTecnico();
    if (!dni) return;

    this.reparaciones.obtenerPedidosDisponibles().subscribe(pedidos => {
      this.pedidosDisponibles.set(pedidos);
    });

    this.reparaciones.obtenerPedidosAsignados(dni).subscribe(pedidos => {
      this.pedidosAsignados.set(pedidos);
    });

    this.reparaciones.tieneReparacionActiva(dni).subscribe(activa => {
      this.tieneReparacionActiva.set(activa);
    });
  }

  asignarPedido(pedido: Reparacion): void {
    const dni = this.dniTecnico();
    if (!dni) return;

    this.reparaciones.asignarPedido(
      pedido.codigoAtencion,
      dni
    ).subscribe(resultado => {
      if (resultado) {
        this.actualizarPedidos();
      }
    });
  }

  empezarPedido(pedido: Reparacion): void {
    if (!this.dniTecnico() || this.cargandoPedido()) return;

    this.cargandoPedido.set(true);
    this.codigoPedidoCargando.set(pedido.codigoAtencion);
    this.mensajeError.set('');

    this.reparaciones.buscarPorCodigoCompleto(
      pedido.codigoAtencion
    ).subscribe({
      next: reparacion => {
        this.cargandoPedido.set(false);
        this.codigoPedidoCargando.set(null);

        if (!reparacion) {
          this.mensajeError.set(
            'No se pudo obtener la información de la reparación. Intenta nuevamente.'
          );
          return;
        }

        this.router.navigate([
          '/tecnico/reparacion',
          pedido.codigoAtencion
        ]);
      },
      error: () => {
        this.cargandoPedido.set(false);
        this.codigoPedidoCargando.set(null);
        this.mensajeError.set(
          'Ocurrió un error al consultar la reparación. Intenta nuevamente.'
        );
      }
    });
  }
}
