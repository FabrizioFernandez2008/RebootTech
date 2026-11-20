import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs';
import { API_URL } from '../api';
import { Reparacion, DatosReparacion } from '../modelos/reparaciones';
import { Cliente } from '../modelos/clientes';
import { Clientes } from './clientes';

export type PedidoConCliente = Reparacion & {
  nombreCliente: string;
};

@Injectable({ providedIn: 'root' })
export class Reparaciones {
  private http = inject(HttpClient);
  private clientes = inject(Clientes);
  private url = `${API_URL}/reparaciones`;

  buscarPorCodigo(codigo: string): Observable<Reparacion | null> {
    return this.http.get<Reparacion>(
      `${this.url}/publica/${encodeURIComponent(codigo.trim())}`
    ).pipe(
      catchError(() => of(null))
    );
  }

  buscarPorCodigoCompleto(codigo: string): Observable<Reparacion | null> {
    return this.http.get<Reparacion>(
      `${this.url}/${encodeURIComponent(codigo.trim())}`
    ).pipe(
      catchError(() => of(null))
    );
  }

  obtenerPedidos(): Observable<PedidoConCliente[]> {
    return this.http.get<Reparacion[]>(this.url).pipe(
      switchMap(reparaciones => this.agregarNombresClientes(reparaciones)),
      catchError(() => of([]))
    );
  }

  buscarPedidos(
    criterio: string,
    busqueda: string
  ): Observable<PedidoConCliente[]> {
    const texto = busqueda.trim();

    if (!texto) {
      return this.obtenerPedidos();
    }

    const params = new HttpParams()
      .set('criterio', criterio)
      .set('busqueda', texto);

    return this.http.get<Reparacion[]>(`${this.url}/buscar`, { params }).pipe(
      switchMap(reparaciones => this.agregarNombresClientes(reparaciones)),
      catchError(() => of([]))
    );
  }

  buscarClientePorDni(dni: string): Observable<Cliente | null> {
    return this.clientes.buscarPorDni(dni);
  }

  confirmarReparacion(codigoAtencion: string): Observable<Reparacion | null> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/confirmar`,
      {}
    ).pipe(
      catchError(() => of(null))
    );
  }

  terminarReparacion(codigoAtencion: string): Observable<Reparacion | null> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/terminar`,
      {}
    ).pipe(
      catchError(() => of(null))
    );
  }

  registrarReparacion(
    datosReparacion: DatosReparacion,
    dniCliente: string
  ): Observable<Reparacion> {
    const solicitud = {
      ...datosReparacion,
      dniCliente
    };

    return this.http.post<Reparacion>(this.url, solicitud);
  }

  contarSolicitudesRegistradas(
    inicio: string,
    fin: string
  ): Observable<number> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<number>(
      `${this.url}/estadisticas/registradas`,
      { params }
    ).pipe(catchError(() => of(0)));
  }

  contarSolicitudesCompletadas(
    inicio: string,
    fin: string
  ): Observable<number> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<number>(
      `${this.url}/estadisticas/completadas`,
      { params }
    ).pipe(catchError(() => of(0)));
  }

  contarSolicitudesEnEspera(
    inicio: string,
    fin: string
  ): Observable<number> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<number>(
      `${this.url}/estadisticas/en-espera`,
      { params }
    ).pipe(catchError(() => of(0)));
  }

  buscarPorDni(dni: string): Observable<Reparacion[]> {
    const params = new HttpParams()
      .set('criterio', 'dni')
      .set('busqueda', dni.trim());

    return this.http.get<Reparacion[]>(`${this.url}/buscar`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  obtenerPedidosDisponibles(): Observable<Reparacion[]> {
    return this.http.get<Reparacion[]>(`${this.url}/disponibles`).pipe(
      catchError(() => of([]))
    );
  }

  obtenerPedidosAsignados(_dniTecnico: string): Observable<Reparacion[]> {
    return this.http.get<Reparacion[]>(`${this.url}/mis-reparaciones`).pipe(
      catchError(() => of([]))
    );
  }

  tieneReparacionActiva(dniTecnico: string): Observable<boolean> {
    return this.obtenerPedidosAsignados(dniTecnico).pipe(
      map(reparaciones => reparaciones.some(reparacion =>
        ['En espera', 'Examinando', 'Reparando'].includes(reparacion.estado)
      ))
    );
  }

  asignarPedido(
    codigoAtencion: string,
    _dniTecnico: string
  ): Observable<boolean> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/asignar`,
      {}
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  marcarComoExaminando(codigoAtencion: string): Observable<boolean> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/examinar`,
      {}
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  guardarDiagnostico(
    codigoAtencion: string,
    _dniTecnico: string,
    diagnostico: string
  ): Observable<boolean> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/diagnostico`,
      { diagnostico: diagnostico.trim() }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  guardarRepuestos(
    codigoAtencion: string,
    _dniTecnico: string,
    observaciones: string
  ): Observable<boolean> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/repuestos`,
      { observaciones: observaciones.trim() }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  finalizarReparacion(
    codigoAtencion: string,
    _dniTecnico: string,
    solucionRealizada: string,
    pruebasRealizadas: string
  ): Observable<boolean> {
    return this.http.patch<Reparacion>(
      `${this.url}/${encodeURIComponent(codigoAtencion)}/finalizar`,
      {
        solucionRealizada: solucionRealizada.trim(),
        pruebasRealizadas: pruebasRealizadas.trim()
      }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private agregarNombresClientes(
    reparaciones: Reparacion[]
  ): Observable<PedidoConCliente[]> {
    if (reparaciones.length === 0) {
      return of([]);
    }

    const dniUnicos = [...new Set(
      reparaciones.map(reparacion => reparacion.dniCliente)
    )];

    const consultas = dniUnicos.map(dni =>
      this.clientes.buscarPorDni(dni).pipe(
        map(cliente => ({
          dni,
          nombre: cliente?.nombreCompleto ?? 'Cliente no encontrado'
        }))
      )
    );

    return forkJoin(consultas).pipe(
      map(resultados => {
        const nombres = new Map(
          resultados.map(resultado => [resultado.dni, resultado.nombre])
        );

        return reparaciones.map(reparacion => ({
          ...reparacion,
          nombreCliente: nombres.get(reparacion.dniCliente) ?? 'Cliente no encontrado'
        }));
      })
    );
  }
}
