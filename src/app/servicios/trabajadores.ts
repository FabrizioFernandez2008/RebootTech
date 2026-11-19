import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, catchError } from 'rxjs';
import { API_URL } from '../api';
import { Trabajador } from '../modelos/trabajadores';

interface TrabajadorSolicitud extends Trabajador {
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class Trabajadores {
  private http = inject(HttpClient);
  private trabajadoresCache = signal<Trabajador[]>([]);

  obtenerTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${API_URL}/trabajadores`).pipe(
      map(trabajadores => trabajadores.map(trabajador => this.normalizarRol(trabajador))),
      tap(trabajadores => this.trabajadoresCache.set(trabajadores))
    );
  }

  buscarPorDni(dni: string): Observable<Trabajador | null> {
    return this.http.get<Trabajador>(`${API_URL}/trabajadores/${dni}`).pipe(
      map(trabajador => this.normalizarRol(trabajador)),
      catchError(() => of(null))
    );
  }

  dniDuplicado(dni: string, dniOriginal: string | null): Observable<boolean> {
    return of(
      this.trabajadoresCache().some(
        trabajador =>
          trabajador.dni === dni &&
          trabajador.dni !== dniOriginal
      )
    );
  }

  usuarioDuplicado(usuario: string, dniOriginal: string | null): Observable<boolean> {
    return of(
      this.trabajadoresCache().some(
        trabajador =>
          trabajador.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
          trabajador.dni !== dniOriginal
      )
    );
  }

  guardarTrabajador(
    trabajador: Trabajador,
    dniOriginal: string | null,
    contrasena: string
  ): Observable<Trabajador> {
    const datos: TrabajadorSolicitud = {
      ...trabajador,
      contrasena
    };

    const solicitud = dniOriginal
      ? this.http.put<Trabajador>(`${API_URL}/trabajadores/${dniOriginal}`, datos)
      : this.http.post<Trabajador>(`${API_URL}/trabajadores`, datos);

    return solicitud.pipe(
      map(respuesta => this.normalizarRol(respuesta))
    );
  }

  puedeDesactivar(trabajador: Trabajador, usuarioActual: string): Observable<boolean> {
    const trabajadores = this.trabajadoresCache();

    if (
      !trabajador.estado ||
      trabajador.usuario.toLowerCase() === usuarioActual.toLowerCase()
    ) {
      return of(false);
    }

    if (trabajador.rol.toLowerCase() === 'administrador') {
      const administradoresActivos = trabajadores.filter(
        elemento =>
          elemento.rol.toLowerCase() === 'administrador' &&
          elemento.estado
      );

      if (administradoresActivos.length <= 1) {
        return of(false);
      }
    }

    return of(true);
  }

  desactivarTrabajador(dni: string, usuarioActual: string): Observable<boolean> {
    return this.http.patch<Trabajador>(
      `${API_URL}/trabajadores/${dni}/desactivar`,
      {}
    ).pipe(
      map(respuesta => {
        this.actualizarCache(respuesta);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  puedeEliminar(trabajador: Trabajador, usuarioActual: string): Observable<boolean> {
    if (trabajador.usuario.toLowerCase() === usuarioActual.toLowerCase()) {
      return of(false);
    }

    if (trabajador.rol.toLowerCase() === 'administrador') {
      const administradoresActivos = this.trabajadoresCache().filter(
        elemento =>
          elemento.rol.toLowerCase() === 'administrador' &&
          elemento.estado
      );

      if (trabajador.estado && administradoresActivos.length <= 1) {
        return of(false);
      }
    }

    return of(true);
  }

  eliminarTrabajador(dni: string, usuarioActual: string): Observable<boolean> {
    return this.http.delete<void>(`${API_URL}/trabajadores/${dni}`).pipe(
      map(() => {
        this.trabajadoresCache.update(
          trabajadores => trabajadores.filter(trabajador => trabajador.dni !== dni)
        );
        return true;
      }),
      catchError(() => of(false))
    );
  }

  private normalizarRol(trabajador: Trabajador): Trabajador {
    return {
      ...trabajador,
      rol: trabajador.rol.toLowerCase()
    };
  }

  private actualizarCache(trabajador: Trabajador): void {
    const trabajadorNormalizado = this.normalizarRol(trabajador);

    this.trabajadoresCache.update(trabajadores =>
      trabajadores.map(elemento =>
        elemento.dni === trabajadorNormalizado.dni
          ? trabajadorNormalizado
          : elemento
      )
    );
  }
}
