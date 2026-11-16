import { Injectable, inject } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Datos } from './datos';
import { Trabajador } from '../modelos/trabajadores';

@Injectable({
  providedIn: 'root'
})
export class Trabajadores {

  private datos = inject(Datos);

  obtenerTrabajadores(): Observable<Trabajador[]> {
    return defer(() =>
      of(this.datos.trabajadores().map(trabajador => ({ ...trabajador })))
    );
  }

  buscarPorDni(dni: string): Observable<Trabajador | null> {
    return defer(() => of(this.buscarPorDniLocal(dni)));
  }

  dniDuplicado(dni: string, dniOriginal: string | null): Observable<boolean> {
    return defer(() => of(this.dniDuplicadoLocal(dni, dniOriginal)));
  }

  usuarioDuplicado(
    usuario: string,
    dniOriginal: string | null
  ): Observable<boolean> {
    return defer(() =>
      of(this.usuarioDuplicadoLocal(usuario, dniOriginal))
    );
  }

  guardarTrabajador(
    trabajador: Trabajador,
    dniOriginal: string | null,
    contrasena: string
  ): Observable<boolean> {
    return defer(() => {
      if (
        this.dniDuplicadoLocal(trabajador.dni, dniOriginal) ||
        this.usuarioDuplicadoLocal(trabajador.usuario, dniOriginal)
      ) {
        return of(false);
      }

      const trabajadorAnterior = dniOriginal
        ? this.buscarPorDniLocal(dniOriginal)
        : null;

      if (trabajadorAnterior && trabajador.dni !== dniOriginal) {
        return of(false);
      }

      const credencialAnterior = trabajadorAnterior
        ? this.datos.credenciales().find(credencial =>
            credencial.usuario.toLowerCase() ===
            trabajadorAnterior.usuario.toLowerCase()
          ) ?? null
        : null;

      if (trabajadorAnterior && !credencialAnterior && contrasena.length < 8) {
        return of(false);
      }

      return this.datos.guardarTrabajador(
        trabajador,
        dniOriginal,
        contrasena
      );
    });
  }

  puedeDesactivar(
    trabajador: Trabajador,
    usuarioActual: string
  ): Observable<boolean> {
    return defer(() =>
      of(this.puedeDesactivarLocal(trabajador, usuarioActual))
    );
  }

  desactivarTrabajador(
    dni: string,
    usuarioActual: string
  ): Observable<boolean> {
    return defer(() => {
      const trabajador = this.buscarPorDniLocal(dni);

      if (
        !trabajador ||
        !this.puedeDesactivarLocal(trabajador, usuarioActual)
      ) {
        return of(false);
      }

      return this.datos.desactivarTrabajador(dni);
    });
  }

  puedeEliminar(
    trabajador: Trabajador,
    usuarioActual: string
  ): Observable<boolean> {
    return defer(() =>
      of(this.puedeEliminarLocal(trabajador, usuarioActual))
    );
  }

  eliminarTrabajador(
    dni: string,
    usuarioActual: string
  ): Observable<boolean> {
    return defer(() => {
      const trabajador = this.buscarPorDniLocal(dni);

      if (
        !trabajador ||
        !this.puedeEliminarLocal(trabajador, usuarioActual)
      ) {
        return of(false);
      }

      return this.datos.eliminarTrabajador(dni);
    });
  }

  tieneCredencial(usuario: string): Observable<boolean> {
    return defer(() =>
      of(this.datos.credenciales().some(
        credencial =>
          credencial.usuario.toLowerCase() === usuario.toLowerCase()
      ))
    );
  }

  private buscarPorDniLocal(dni: string): Trabajador | null {
    const trabajador = this.datos.trabajadores().find(
      actual => actual.dni === dni
    );

    return trabajador ? { ...trabajador } : null;
  }

  private dniDuplicadoLocal(
    dni: string,
    dniOriginal: string | null
  ): boolean {
    return this.datos.trabajadores().some(
      trabajador =>
        trabajador.dni === dni &&
        trabajador.dni !== dniOriginal
    );
  }

  private usuarioDuplicadoLocal(
    usuario: string,
    dniOriginal: string | null
  ): boolean {
    return this.datos.trabajadores().some(
      trabajador =>
        trabajador.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
        trabajador.dni !== dniOriginal
    );
  }

  private puedeDesactivarLocal(
    trabajador: Trabajador,
    usuarioActual: string
  ): boolean {
    if (!trabajador.estado) return false;
    if (trabajador.usuario === usuarioActual) return false;

    if (trabajador.rol === 'administrador') {
      const administradoresActivos = this.datos.trabajadores().filter(actual =>
        actual.rol === 'administrador' && actual.estado
      ).length;

      if (administradoresActivos <= 1) return false;
    }

    return true;
  }

  private puedeEliminarLocal(
    trabajador: Trabajador,
    usuarioActual: string
  ): boolean {
    if (trabajador.usuario === usuarioActual) return false;

    if (trabajador.rol === 'administrador' && trabajador.estado) {
      const administradoresActivos = this.datos.trabajadores().filter(actual =>
        actual.rol === 'administrador' && actual.estado
      ).length;

      if (administradoresActivos <= 1) return false;
    }

    return true;
  }
}
