import { Injectable, inject } from '@angular/core';
import { Observable, defer, of, map } from 'rxjs';
import { Datos } from './datos';
import { Reparacion, DatosReparacion } from '../modelos/reparaciones';
import { Cliente } from '../modelos/clientes';

export type PedidoConCliente = Reparacion & {
  nombreCliente: string;
};

@Injectable({
  providedIn: 'root'
})
export class Reparaciones {

  private datos = inject(Datos);

  buscarPorCodigo(codigo: string): Observable<Reparacion | null> {
    return defer(() => of(this.buscarPorCodigoLocal(codigo)));
  }

  obtenerPedidos(): Observable<PedidoConCliente[]> {
    return defer(() => of(this.obtenerPedidosLocal()));
  }

  buscarPedidos(
    criterio: string,
    busqueda: string
  ): Observable<PedidoConCliente[]> {
    return defer(() => {
      const texto = busqueda.trim().toLowerCase();

      if (!texto) return of(this.obtenerPedidosLocal());

      const pedidos = this.obtenerPedidosLocal().filter(pedido => {
        if (criterio === 'codigo') {
          return pedido.codigoAtencion.toLowerCase().includes(texto);
        }

        return pedido.dniCliente.includes(texto);
      });

      return of(pedidos);
    });
  }

  buscarClientePorDni(dni: string): Observable<Cliente | null> {
    return defer(() => {
      const cliente = this.datos.clientes().find(
        actual => actual.dni === dni
      );

      return of(cliente ? { ...cliente } : null);
    });
  }

  confirmarReparacion(
    codigoAtencion: string
  ): Observable<Reparacion | null> {
    return defer(() => {
      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (!pedido || pedido.estado !== 'Esperando confirmación') {
        return of(null);
      }

      const pedidoActualizado: Reparacion = {
        ...pedido,
        estado: 'En espera'
      };

      return this.datos.actualizarReparacion(pedidoActualizado).pipe(
        map(actualizado => actualizado ? pedidoActualizado : null)
      );
    });
  }

  terminarReparacion(
    codigoAtencion: string
  ): Observable<Reparacion | null> {
    return defer(() => {
      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (
        !pedido ||
        !['Esperando confirmación', 'Listo para recojo'].includes(pedido.estado)
      ) {
        return of(null);
      }

      const pedidoActualizado: Reparacion = {
        ...pedido,
        estado: 'Terminado',
        fechaFinalizacion: this.formatearFecha(new Date())
      };

      return this.datos.actualizarReparacion(pedidoActualizado).pipe(
        map(actualizado => actualizado ? pedidoActualizado : null)
      );
    });
  }

  registrarReparacion(
    datosReparacion: DatosReparacion,
    dniCliente: string
  ): Observable<Reparacion> {
    return defer(() => {
      const numeros = this.datos.reparaciones().map(p =>
        Number(p.codigoAtencion.replace('RT-', ''))
      );

      const siguiente = Math.max(0, ...numeros) + 1;

      const nuevaReparacion: Reparacion = {
        ...datosReparacion,
        codigoAtencion: `RT-${String(siguiente).padStart(3, '0')}`,
        dniCliente,
        fechaIngreso: this.formatearFecha(new Date()),
        estado: 'En espera',
        dniTecnico: null
      };

      return this.datos.agregarReparacion(nuevaReparacion).pipe(
        map(() => nuevaReparacion)
      );
    });
  }

  contarSolicitudesRegistradas(
    inicio: string,
    fin: string
  ): Observable<number> {
    return defer(() => of(
      this.datos.reparaciones().filter(reparacion =>
        reparacion.fechaIngreso >= inicio &&
        reparacion.fechaIngreso <= fin
      ).length
    ));
  }

  contarSolicitudesCompletadas(
    inicio: string,
    fin: string
  ): Observable<number> {
    return defer(() => of(
      this.datos.reparaciones().filter(reparacion =>
        ['Listo para recojo', 'Terminado'].includes(reparacion.estado) &&
        !!reparacion.fechaFinalizacion &&
        reparacion.fechaFinalizacion >= inicio &&
        reparacion.fechaFinalizacion <= fin
      ).length
    ));
  }

  contarSolicitudesEnEspera(
    inicio: string,
    fin: string
  ): Observable<number> {
    return defer(() => of(
      this.datos.reparaciones().filter(reparacion =>
        ['En espera', 'Esperando confirmación'].includes(reparacion.estado) &&
        reparacion.fechaIngreso >= inicio &&
        reparacion.fechaIngreso <= fin
      ).length
    ));
  }

  buscarPorDni(dni: string): Observable<Reparacion[]> {
    return defer(() => of(
      this.datos.reparaciones()
        .filter(reparacion => reparacion.dniCliente === dni.trim())
        .map(reparacion => ({ ...reparacion }))
    ));
  }

  obtenerPedidosDisponibles(): Observable<Reparacion[]> {
    return defer(() => of(
      this.datos.reparaciones()
        .filter(reparacion =>
          reparacion.estado === 'En espera' &&
          reparacion.dniTecnico === null
        )
        .map(reparacion => ({ ...reparacion }))
    ));
  }

  obtenerPedidosAsignados(dniTecnico: string): Observable<Reparacion[]> {
    return defer(() => of(
      this.obtenerPedidosAsignadosLocal(dniTecnico)
    ));
  }

  tieneReparacionActiva(dniTecnico: string): Observable<boolean> {
    return defer(() => of(
      this.obtenerPedidosAsignadosLocal(dniTecnico).some(reparacion =>
        ['En espera', 'Examinando', 'Reparando'].includes(reparacion.estado)
      )
    ));
  }

  asignarPedido(
    codigoAtencion: string,
    dniTecnico: string
  ): Observable<boolean> {
    return defer(() => {
      const tieneActiva = this.obtenerPedidosAsignadosLocal(dniTecnico).some(
        reparacion =>
          ['En espera', 'Examinando', 'Reparando'].includes(reparacion.estado)
      );

      if (tieneActiva) return of(false);

      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (
        !pedido ||
        pedido.estado !== 'En espera' ||
        pedido.dniTecnico !== null
      ) {
        return of(false);
      }

      return this.datos.actualizarReparacion({
        ...pedido,
        dniTecnico
      });
    });
  }

  guardarDiagnostico(
    codigoAtencion: string,
    dniTecnico: string,
    diagnostico: string
  ): Observable<boolean> {
    return defer(() => {
      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (
        !pedido ||
        pedido.dniTecnico !== dniTecnico ||
        !diagnostico.trim() ||
        !['En espera', 'Examinando', 'Reparando'].includes(pedido.estado)
      ) {
        return of(false);
      }

      return this.datos.actualizarReparacion({
        ...pedido,
        diagnostico: diagnostico.trim(),
        estado: 'Reparando'
      });
    });
  }

  guardarRepuestos(
    codigoAtencion: string,
    dniTecnico: string,
    observaciones: string
  ): Observable<boolean> {
    return defer(() => {
      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (
        !pedido ||
        pedido.dniTecnico !== dniTecnico ||
        pedido.estado !== 'Reparando' ||
        !observaciones.trim()
      ) {
        return of(false);
      }

      return this.datos.actualizarReparacion({
        ...pedido,
        observaciones: observaciones.trim(),
        estado: 'Esperando confirmación'
      });
    });
  }

  finalizarReparacion(
    codigoAtencion: string,
    dniTecnico: string,
    solucionRealizada: string,
    pruebasRealizadas: string
  ): Observable<boolean> {
    return defer(() => {
      const pedido = this.buscarPorCodigoLocal(codigoAtencion);

      if (
        !pedido ||
        pedido.dniTecnico !== dniTecnico ||
        pedido.estado !== 'Reparando' ||
        !solucionRealizada.trim() ||
        !pruebasRealizadas.trim()
      ) {
        return of(false);
      }

      return this.datos.actualizarReparacion({
        ...pedido,
        solucionRealizada: solucionRealizada.trim(),
        pruebasRealizadas: pruebasRealizadas.trim(),
        fechaFinalizacion: this.formatearFecha(new Date()),
        estado: 'Listo para recojo'
      });
    });
  }

  private buscarPorCodigoLocal(codigo: string): Reparacion | null {
    const reparacion = this.datos.reparaciones().find(
      actual =>
        actual.codigoAtencion.toLowerCase() === codigo.trim().toLowerCase()
    );

    return reparacion ? { ...reparacion } : null;
  }

  private obtenerPedidosLocal(): PedidoConCliente[] {
    return this.datos.reparaciones().map(reparacion => {
      const cliente = this.datos.clientes().find(
        actual => actual.dni === reparacion.dniCliente
      );

      return {
        ...reparacion,
        nombreCliente: cliente?.nombreCompleto ?? 'Cliente no encontrado'
      };
    });
  }

  private obtenerPedidosAsignadosLocal(dniTecnico: string): Reparacion[] {
    return this.datos.reparaciones()
      .filter(reparacion =>
        reparacion.dniTecnico === dniTecnico &&
        [
          'En espera',
          'Examinando',
          'Reparando',
          'Esperando confirmación'
        ].includes(reparacion.estado)
      )
      .map(reparacion => ({ ...reparacion }));
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
