import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultar-busqueda',
  imports: [FormsModule],
  templateUrl: './consultar-busqueda.html',
  styleUrl: './consultar-busqueda.css',
})
export class ConsultarBusqueda {

  codigoAtencion = '';

  @Output() consultar = new EventEmitter<string>();

  buscar() {
    const codigo = this.codigoAtencion.trim().toUpperCase();

    if (!codigo) return;

    this.consultar.emit(codigo);
  }

}
