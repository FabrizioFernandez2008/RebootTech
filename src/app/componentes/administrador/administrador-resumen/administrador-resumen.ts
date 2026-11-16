import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reparaciones } from '../../../servicios/reparaciones';

@Component({
  selector: 'app-administrador-resumen',
  imports: [FormsModule],
  templateUrl: './administrador-resumen.html',
  styleUrl: './administrador-resumen.css',
})
export class AdministradorResumen {

  private reparaciones = inject(Reparaciones);

  periodoSeleccionado = signal('hoy');

  fechaInicio = signal('');
  fechaFin = signal('');

  solicitudesRegistradas = signal(0);
  solicitudesCompletadas = signal(0);
  solicitudesEnEspera = signal(0);

  mostrarFechas = computed(() =>
    this.periodoSeleccionado() === 'personalizado'
  );

  rangoFechas = computed(() => {
    const hoy = new Date();
    let inicio: Date;
    let fin: Date;

    switch (this.periodoSeleccionado()) {
      case 'semana': {
        inicio = new Date(hoy);
        const dia = inicio.getDay();
        inicio.setDate(inicio.getDate() - (dia === 0 ? 6 : dia - 1));
        fin = new Date(inicio);
        fin.setDate(fin.getDate() + 6);
        break;
      }

      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        break;

      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1);
        fin = new Date(hoy.getFullYear(), 11, 31);
        break;

      case 'personalizado': {
        const desde = this.fechaInicio();
        const hasta = this.fechaFin();

        if (!desde || !hasta || desde > hasta) return null;

        return { inicio: desde, fin: hasta };
      }

      default:
        inicio = new Date(hoy);
        fin = new Date(hoy);
    }

    return {
      inicio: this.formatearFecha(inicio),
      fin: this.formatearFecha(fin)
    };
  });

  constructor() {
    effect(onCleanup => {
      const rango = this.rangoFechas();

      if (!rango) {
        this.solicitudesRegistradas.set(0);
        this.solicitudesCompletadas.set(0);
        this.solicitudesEnEspera.set(0);
        return;
      }

      const suscripcionRegistradas =
        this.reparaciones.contarSolicitudesRegistradas(
          rango.inicio,
          rango.fin
        ).subscribe(valor => this.solicitudesRegistradas.set(valor));

      const suscripcionCompletadas =
        this.reparaciones.contarSolicitudesCompletadas(
          rango.inicio,
          rango.fin
        ).subscribe(valor => this.solicitudesCompletadas.set(valor));

      const suscripcionEnEspera =
        this.reparaciones.contarSolicitudesEnEspera(
          rango.inicio,
          rango.fin
        ).subscribe(valor => this.solicitudesEnEspera.set(valor));

      onCleanup(() => {
        suscripcionRegistradas.unsubscribe();
        suscripcionCompletadas.unsubscribe();
        suscripcionEnEspera.unsubscribe();
      });
    });
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
