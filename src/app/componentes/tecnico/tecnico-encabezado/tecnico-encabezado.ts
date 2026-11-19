import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Autenticacion } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-tecnico-encabezado',
  imports: [],
  templateUrl: './tecnico-encabezado.html',
  styleUrl: './tecnico-encabezado.css',
})
export class TecnicoEncabezado {

  private autenticacion = inject(Autenticacion);
  private router = inject(Router);

  nombreTecnico = computed(() =>
    `${this.autenticacion.usuarioActual()?.nombres ?? ''} ${this.autenticacion.usuarioActual()?.apellidos ?? ''}`.trim() || 'Técnico'
  );

  cerrarSesion() {
    this.autenticacion.cerrarSesion().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
