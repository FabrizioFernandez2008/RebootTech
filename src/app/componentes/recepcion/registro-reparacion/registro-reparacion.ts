import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosReparacion } from '../../../modelos/reparaciones';

@Component({
  selector: 'app-registro-reparacion',
  imports: [FormsModule],
  templateUrl: './registro-reparacion.html',
  styleUrl: './registro-reparacion.css',
})
export class RegistroReparacion {

  tipoEquipo = signal('');
  marca = signal('');
  modelo = signal('');
  numeroSerie = signal('');
  accesorios = signal('');
  problemaReportado = signal('');
  observaciones = signal('');

  registrar = output<DatosReparacion>();

  registrarReparacion() {
    if (
      !this.tipoEquipo().trim() ||
      !this.marca().trim() ||
      !this.modelo().trim() ||
      !this.problemaReportado().trim()
    ) {
      return;
    }

    const datos: DatosReparacion = {
      tipoEquipo: this.tipoEquipo(),
      marca: this.marca().trim(),
      modelo: this.modelo().trim(),
      numeroSerie: this.numeroSerie().trim() || null,
      accesorios: this.accesorios().trim() || null,
      problemaReportado: this.problemaReportado().trim(),
      observaciones: this.observaciones().trim() || null
    };

    this.registrar.emit(datos);
  }

}
