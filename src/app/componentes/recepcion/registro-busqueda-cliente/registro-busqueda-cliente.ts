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

  mostrarErrorDni = false;

  validarTeclaDni(event: KeyboardEvent): void {
    const tecla = event.key;

    if (
      event.ctrlKey ||
      event.metaKey ||
      tecla.length > 1 ||
      /^[0-9]$/.test(tecla)
    ) {
      return;
    }

    event.preventDefault();
    this.mostrarErrorDni = true;
  }
}
