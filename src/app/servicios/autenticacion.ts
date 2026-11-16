import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Datos } from './datos';

@Injectable({
  providedIn: 'root'
})
export class Autenticacion {

  private datos = inject(Datos);

  private usuarioSesion = signal<string | null>(null);

  usuarioActual = computed(() => {
    const usuario = this.usuarioSesion();

    if (!usuario) return null;

    return this.datos.trabajadores().find(
      trabajador =>
        trabajador.usuario.toLowerCase() === usuario.toLowerCase() &&
        trabajador.estado
    ) ?? null;
  });

  iniciarSesion(usuario: string, contrasena: string): Observable<boolean> {
    return defer(() => {
      const cuenta = this.datos.credenciales().find(
        credencial =>
          credencial.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
          credencial.contrasena === contrasena &&
          credencial.estado
      );

      if (!cuenta) return of(false);

      const trabajador = this.datos.trabajadores().find(
        persona =>
          persona.usuario.toLowerCase() === cuenta.usuario.toLowerCase() &&
          persona.estado
      );

      if (!trabajador) return of(false);

      this.usuarioSesion.set(trabajador.usuario);

      return of(true);
    });
  }

  cerrarSesion(): Observable<void> {
    return defer(() => {
      this.usuarioSesion.set(null);
      return of(void 0);
    });
  }

  tieneRol(rol: string): Observable<boolean> {
    return defer(() =>
      of(this.usuarioActual()?.rol === rol)
    );
  }

  estaAutenticado(): Observable<boolean> {
    return defer(() =>
      of(this.usuarioActual() !== null)
    );
  }
}
