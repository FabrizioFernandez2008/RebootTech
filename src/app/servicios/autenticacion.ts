import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, map, fromEvent, merge, timer, Subscription, switchMap } from 'rxjs';
import { API_URL, TOKEN_KEY, TRABAJADOR_KEY } from '../api';
import {
  InicioSesionDTO,
  InicioSesionRespuesta,
  TrabajadorSesion
} from '../modelos/autenticacion';

@Injectable({
  providedIn: 'root'
})
export class Autenticacion {
  private http = inject(HttpClient);
  private router = inject(Router);
  private controlInactividad?: Subscription;

  usuarioActual = signal<TrabajadorSesion | null>(
    this.obtenerTrabajadorGuardado()
  );

  constructor() {
    if (sessionStorage.getItem(TOKEN_KEY)) {
      this.iniciarControlInactividad();
    }
  }

  iniciarSesion(usuario: string, contrasena: string): Observable<TrabajadorSesion> {
    const datos: InicioSesionDTO = {
      usuario: usuario.trim(),
      contrasena
    };

    return this.http.post<InicioSesionRespuesta>(
      `${API_URL}/autenticacion/iniciar-sesion`,
      datos
    ).pipe(
      tap(respuesta => {
        sessionStorage.setItem(TOKEN_KEY, respuesta.token);
        sessionStorage.setItem(
          TRABAJADOR_KEY,
          JSON.stringify(respuesta.trabajador)
        );

        this.usuarioActual.set(respuesta.trabajador);
        this.iniciarControlInactividad();
      }),
      map(respuesta => respuesta.trabajador)
    );
  }

  cerrarSesion(): Observable<void> {
    this.detenerControlInactividad();
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TRABAJADOR_KEY);
    this.usuarioActual.set(null);

    return of(void 0);
  }

  tieneRol(rol: string): Observable<boolean> {
    return of(
      this.usuarioActual()?.rol.toUpperCase() === rol.toUpperCase()
    );
  }

  estaAutenticado(): Observable<boolean> {
    return of(
      sessionStorage.getItem(TOKEN_KEY) !== null &&
      this.usuarioActual() !== null
    );
  }

  private iniciarControlInactividad(): void {
    this.detenerControlInactividad();

    const eventos = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ].map(evento => fromEvent(document, evento));

    this.controlInactividad = merge(
      of(null),
      ...eventos
    ).pipe(
      switchMap(() => timer(15 * 60 * 1000))
    ).subscribe(() => {
      this.cerrarSesion();
      this.router.navigate(['/login']);
    });
  }

  private detenerControlInactividad(): void {
    this.controlInactividad?.unsubscribe();
    this.controlInactividad = undefined;
  }

  private obtenerTrabajadorGuardado(): TrabajadorSesion | null {
    const trabajadorGuardado = sessionStorage.getItem(TRABAJADOR_KEY);

    if (!trabajadorGuardado) {
      return null;
    }

    try {
      return JSON.parse(trabajadorGuardado) as TrabajadorSesion;
    } catch {
      sessionStorage.removeItem(TRABAJADOR_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
}
