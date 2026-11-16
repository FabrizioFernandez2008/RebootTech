import { Injectable, inject } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Datos } from './datos';
import { Cliente } from '../modelos/clientes';

@Injectable({
  providedIn: 'root'
})
export class Clientes {

  private datos = inject(Datos);

  buscarPorDni(dni: string): Observable<Cliente | null> {
    return defer(() => {
      const cliente = this.datos.clientes().find(
        actual => actual.dni === dni.trim()
      );

      return of(cliente ? { ...cliente } : null);
    });
  }

  agregarCliente(cliente: Cliente): Observable<boolean> {
    return this.datos.agregarCliente(cliente);
  }

  actualizarCliente(clienteActualizado: Cliente): Observable<boolean> {
    return this.datos.actualizarCliente(clienteActualizado);
  }
}
