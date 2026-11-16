import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-busqueda-cliente',
  imports: [FormsModule],
  templateUrl: './registro-busqueda-cliente.html',
  styleUrl: './registro-busqueda-cliente.css',
})
export class RegistroBusquedaCliente {

  dni = signal('');

  buscar = output<string>();

 buscarCliente() {
    const dniIngresado = this.dni().trim();

    if (!/^\d{8}$/.test(dniIngresado)) {
      return;
    }

    this.buscar.emit(dniIngresado);
  }
}
