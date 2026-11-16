import { Injectable, signal } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { CLIENTES } from '../datos/clientes';
import { REPARACIONES } from '../datos/reparaciones';
import { TRABAJADORES } from '../datos/trabajadores';
import { CREDENCIALES } from '../datos/credenciales';
import { Cliente } from '../modelos/clientes';
import { Reparacion } from '../modelos/reparaciones';
import { Trabajador } from '../modelos/trabajadores';
import { Credencial } from '../modelos/credenciales';

@Injectable({
  providedIn: 'root'
})
export class Datos {

  private clientesSignal = signal<Cliente[]>([...CLIENTES]);
  private reparacionesSignal = signal<Reparacion[]>([...REPARACIONES]);
  private trabajadoresSignal = signal<Trabajador[]>([...TRABAJADORES]);
  private credencialesSignal = signal<Credencial[]>([...CREDENCIALES]);

  clientes = this.clientesSignal.asReadonly();
  reparaciones = this.reparacionesSignal.asReadonly();
  trabajadores = this.trabajadoresSignal.asReadonly();
  credenciales = this.credencialesSignal.asReadonly();

  agregarCliente(cliente: Cliente): Observable<boolean> {
    return defer(() => {
      const existe = this.clientesSignal().some(
        actual => actual.dni === cliente.dni
      );

      if (existe) return of(false);

      this.clientesSignal.update(clientes => [
        ...clientes,
        { ...cliente }
      ]);

      return of(true);
    });
  }

  actualizarCliente(clienteActualizado: Cliente): Observable<boolean> {
    return defer(() => {
      const existe = this.clientesSignal().some(
        cliente => cliente.dni === clienteActualizado.dni
      );

      if (!existe) return of(false);

      this.clientesSignal.update(clientes =>
        clientes.map(cliente =>
          cliente.dni === clienteActualizado.dni
            ? { ...clienteActualizado }
            : cliente
        )
      );

      return of(true);
    });
  }

  agregarReparacion(reparacion: Reparacion): Observable<void> {
    return defer(() => {
      this.reparacionesSignal.update(reparaciones => [
        ...reparaciones,
        { ...reparacion }
      ]);

      return of(void 0);
    });
  }

  actualizarReparacion(
    reparacionActualizada: Reparacion
  ): Observable<boolean> {
    return defer(() => {
      const existe = this.reparacionesSignal().some(
        reparacion =>
          reparacion.codigoAtencion === reparacionActualizada.codigoAtencion
      );

      if (!existe) return of(false);

      this.reparacionesSignal.update(reparaciones =>
        reparaciones.map(reparacion =>
          reparacion.codigoAtencion === reparacionActualizada.codigoAtencion
            ? { ...reparacionActualizada }
            : reparacion
        )
      );

      return of(true);
    });
  }

  guardarTrabajador(
    trabajador: Trabajador,
    dniOriginal: string | null,
    contrasena: string
  ): Observable<boolean> {
    return defer(() => {
      const trabajadorAnterior = dniOriginal
        ? this.trabajadoresSignal().find(
            actual => actual.dni === dniOriginal
          )
        : null;

      const credencialAnterior = trabajadorAnterior
        ? this.credencialesSignal().find(
            credencial =>
              credencial.usuario.toLowerCase() ===
              trabajadorAnterior.usuario.toLowerCase()
          ) ?? null
        : null;

      if (trabajadorAnterior) {
        this.trabajadoresSignal.update(trabajadores =>
          trabajadores.map(actual =>
            actual.dni === dniOriginal
              ? { ...trabajador }
              : actual
          )
        );
      } else {
        this.trabajadoresSignal.update(trabajadores => [
          ...trabajadores,
          { ...trabajador }
        ]);
      }

      const credencialActualizada: Credencial = {
        usuario: trabajador.usuario,
        contrasena: contrasena || credencialAnterior?.contrasena || '',
        rol: trabajador.rol,
        estado: trabajador.estado
      };

      if (credencialAnterior) {
        this.credencialesSignal.update(credenciales =>
          credenciales.map(credencial =>
            credencial.usuario.toLowerCase() ===
            credencialAnterior.usuario.toLowerCase()
              ? credencialActualizada
              : credencial
          )
        );
      } else {
        this.credencialesSignal.update(credenciales => [
          ...credenciales,
          credencialActualizada
        ]);
      }

      return of(true);
    });
  }

  desactivarTrabajador(dni: string): Observable<boolean> {
    return defer(() => {
      const trabajador = this.trabajadoresSignal().find(
        actual => actual.dni === dni
      );

      if (!trabajador) return of(false);

      this.trabajadoresSignal.update(trabajadores =>
        trabajadores.map(actual =>
          actual.dni === dni
            ? { ...actual, estado: false }
            : actual
        )
      );

      this.credencialesSignal.update(credenciales =>
        credenciales.map(credencial =>
          credencial.usuario.toLowerCase() ===
          trabajador.usuario.toLowerCase()
            ? { ...credencial, estado: false }
            : credencial
        )
      );

      return of(true);
    });
  }

  eliminarTrabajador(dni: string): Observable<boolean> {
    return defer(() => {
      const trabajador = this.trabajadoresSignal().find(
        actual => actual.dni === dni
      );

      if (!trabajador) return of(false);

      this.trabajadoresSignal.update(trabajadores =>
        trabajadores.filter(actual => actual.dni !== dni)
      );

      this.credencialesSignal.update(credenciales =>
        credenciales.filter(credencial =>
          credencial.usuario.toLowerCase() !==
          trabajador.usuario.toLowerCase()
        )
      );

      return of(true);
    });
  }
}
