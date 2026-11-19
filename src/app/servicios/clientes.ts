import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { API_URL } from '../api';
import { Cliente } from '../modelos/clientes';

@Injectable({
  providedIn: 'root'
})
export class Clientes {

  private http = inject(HttpClient);

  buscarPorDni(dni: string): Observable<Cliente | null> {
    return this.http.get<Cliente>(
      `${API_URL}/clientes/${encodeURIComponent(dni.trim())}`
    ).pipe(
      catchError(() => of(null))
    );
  }

  agregarCliente(cliente: Cliente): Observable<boolean> {
    return this.http.post<void>(
      `${API_URL}/clientes`,
      cliente
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  actualizarCliente(clienteActualizado: Cliente): Observable<boolean> {
    return this.http.put<void>(
      `${API_URL}/clientes/${encodeURIComponent(clienteActualizado.dni)}`,
      clienteActualizado
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
