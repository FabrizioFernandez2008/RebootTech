import { Component, signal, inject } from '@angular/core';
import { ConsultarEncabezado } from '../../componentes/consultar-seguimiento/consultar-encabezado/consultar-encabezado';
import { ConsultarBusqueda } from '../../componentes/consultar-seguimiento/consultar-busqueda/consultar-busqueda';
import { ConsultarResultado } from '../../componentes/consultar-seguimiento/consultar-resultado/consultar-resultado';
import { Footer } from '../../componentes/footer/footer';
import { Reparaciones } from '../../servicios/reparaciones';
import { Reparacion } from '../../modelos/reparaciones';

@Component({
  selector: 'app-consultar-seguimiento',
  imports: [
    ConsultarEncabezado,
    ConsultarBusqueda,
    ConsultarResultado,
    Footer
  ],
  templateUrl: './consultar-seguimiento.html',
  styleUrl: './consultar-seguimiento.css',
})
export class ConsultarSeguimiento {

  private reparaciones = inject(Reparaciones);

  reparacionEncontrada = signal<Reparacion | null>(null);
  mensajeError = signal('');

  consultarReparacion(codigo: string): void {
    this.reparaciones.buscarPorCodigo(codigo).subscribe({
      next: reparacion => {
        if (!reparacion) {
          this.reparacionEncontrada.set(null);
          this.mensajeError.set(
            'No encontramos una reparación con ese código de atención.'
          );
          return;
        }

        this.mensajeError.set('');
        this.reparacionEncontrada.set(reparacion);
      },
      error: () => {
        this.reparacionEncontrada.set(null);
        this.mensajeError.set(
          'Ocurrió un error al consultar la reparación.'
        );
      }
    });
  }
}
