import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticacion } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-recepcion-encabezado',
  imports: [RouterLink],
  templateUrl: './recepcion-encabezado.html',
  styleUrl: './recepcion-encabezado.css',
})
export class RecepcionEncabezado {

  private router = inject(Router);
  private autenticacion = inject(Autenticacion);

  cerrarSesion(): void {
    this.autenticacion.cerrarSesion().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
