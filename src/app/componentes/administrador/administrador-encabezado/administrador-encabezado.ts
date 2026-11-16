import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Autenticacion } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-administrador-encabezado',
  imports: [RouterLink],
  templateUrl: './administrador-encabezado.html',
  styleUrl: './administrador-encabezado.css',
})
export class AdministradorEncabezado {

  private autenticacion = inject(Autenticacion);
  private router = inject(Router);

  cerrarSesion() {
    this.autenticacion.cerrarSesion().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
