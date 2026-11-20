import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reparaciones } from '../../../servicios/reparaciones';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-administrador-busqueda',
  imports: [FormsModule],
  templateUrl: './administrador-busqueda.html',
  styleUrl: './administrador-busqueda.css',
})
export class AdministradorBusqueda {

  private reparaciones = inject(Reparaciones);

  criterio = signal('codigo');
  busqueda = signal('');

  resultados = signal<Reparacion[]>([]);
  busquedaRealizada = signal(false);

  solicitudSeleccionada = signal<Reparacion | null>(null);
  clienteSeleccionado = signal<Cliente | null>(null);

  busquedaValida = computed(() => {
    const texto = this.busqueda().trim();

    if (this.criterio() === 'codigo') {
      return /^RT-\d{3}$/i.test(texto);
    }

    return /^\d{8}$/.test(texto);
  });

  cambiarCriterio(criterio: string) {
    this.criterio.set(criterio);
    this.busqueda.set('');
    this.resultados.set([]);
    this.busquedaRealizada.set(false);
    this.solicitudSeleccionada.set(null);
    this.clienteSeleccionado.set(null);
  }

  actualizarBusqueda(valor: string) {
    if (this.criterio() === 'codigo') {
      this.busqueda.set(valor.toUpperCase().slice(0, 6));
    } else {
      this.busqueda.set(valor.replace(/\D/g, '').slice(0, 8));
    }

    this.busquedaRealizada.set(false);
    this.resultados.set([]);
    this.solicitudSeleccionada.set(null);
    this.clienteSeleccionado.set(null);
  }

  buscar() {
    if (!this.busquedaValida()) return;

    const texto = this.busqueda().trim().toUpperCase();

    const solicitud = this.criterio() === 'codigo'
      ? this.reparaciones.buscarPorCodigoCompleto(texto).subscribe(reparacion => {
          this.resultados.set(reparacion ? [reparacion] : []);
          this.busquedaRealizada.set(true);
        })
      : this.reparaciones.buscarPorDni(texto).subscribe(resultados => {
          this.resultados.set(resultados);
          this.busquedaRealizada.set(true);
        });

    this.solicitudSeleccionada.set(null);
    this.clienteSeleccionado.set(null);
  }

  seleccionarSolicitud(solicitud: Reparacion) {
    this.solicitudSeleccionada.set(solicitud);
    this.clienteSeleccionado.set(null);

    this.reparaciones.buscarClientePorDni(
      solicitud.dniCliente
    ).subscribe(cliente => {
      if (
        this.solicitudSeleccionada()?.codigoAtencion ===
        solicitud.codigoAtencion
      ) {
        this.clienteSeleccionado.set(cliente);
      }
    });
  }

  cerrarDetalle() {
    this.solicitudSeleccionada.set(null);
    this.clienteSeleccionado.set(null);
  }
}
