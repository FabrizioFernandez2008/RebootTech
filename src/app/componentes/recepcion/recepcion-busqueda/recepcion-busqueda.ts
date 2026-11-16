import { Component, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recepcion-busqueda',
  imports: [FormsModule],
  templateUrl: './recepcion-busqueda.html',
  styleUrl: './recepcion-busqueda.css',
})
export class RecepcionBusqueda {

  @Output() buscar = new EventEmitter<{ criterio: string, busqueda: string }>();
  @Output() limpiar = new EventEmitter<void>();

  criterio = signal('codigo');
  busqueda = signal('');

  buscarPedidos() {
    this.buscar.emit({
      criterio: this.criterio(),
      busqueda: this.busqueda()
    });
  }

  limpiarBusqueda() {
    this.busqueda.set('');
    this.criterio.set('codigo');
    this.limpiar.emit();
  }
}
