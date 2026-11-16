import { Component, signal, output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroBusquedaCliente } from '../registro-busqueda-cliente/registro-busqueda-cliente';
import { Clientes } from '../../../servicios/clientes';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-registro-cliente',
  imports: [RegistroBusquedaCliente, FormsModule],
  templateUrl: './registro-cliente.html',
  styleUrl: './registro-cliente.css',
})
export class RegistroCliente {

  private clientes = inject(Clientes);

  clienteEncontrado = signal<Cliente | null>(null);
  clienteFormulario = signal<Cliente | null>(null);

  registrarNuevoCliente = signal(false);
  busquedaRealizada = signal(false);
  dniNuevoCliente = signal('');

  nombres = signal('');
  apellidos = signal('');

  clienteListo = output<Cliente>();
  busquedaIniciada = output<void>();

  buscarCliente(dni: string): void {
    this.busquedaIniciada.emit();

    this.clienteEncontrado.set(null);
    this.clienteFormulario.set(null);
    this.registrarNuevoCliente.set(false);
    this.busquedaRealizada.set(false);

    this.dniNuevoCliente.set(dni);
    this.nombres.set('');
    this.apellidos.set('');

    this.clientes.buscarPorDni(dni).subscribe({
      next: cliente => {
        this.clienteEncontrado.set(cliente);

        this.clienteFormulario.set(
          cliente
            ? { ...cliente }
            : {
                dni,
                nombreCompleto: '',
                telefono: '',
                correo: ''
              }
        );

        this.busquedaRealizada.set(true);
      }
    });
  }

  actualizarCampo(campo: 'telefono' | 'correo', valor: string): void {
    const valorActualizado = campo === 'telefono'
      ? valor.replace(/\D/g, '').slice(0, 9)
      : valor;

    this.clienteFormulario.update(cliente =>
      cliente
        ? { ...cliente, [campo]: valorActualizado }
        : null
    );
  }

  registrarCliente(): void {
    const formulario = this.clienteFormulario();

    if (
      !this.nombres().trim() ||
      !this.apellidos().trim() ||
      !formulario ||
      !/^\d{9}$/.test(formulario.telefono) ||
      !formulario.correo.trim()
    ) return;

    const cliente: Cliente = {
      dni: this.dniNuevoCliente(),
      nombreCompleto: `${this.nombres().trim()} ${this.apellidos().trim()}`,
      telefono: formulario.telefono,
      correo: formulario.correo.trim()
    };

    this.clientes.agregarCliente(cliente).subscribe({
      next: registrado => {
        if (!registrado) return;

        this.clienteEncontrado.set(cliente);
        this.clienteFormulario.set({ ...cliente });
        this.registrarNuevoCliente.set(false);

        this.clienteListo.emit(cliente);
      }
    });
  }

  confirmarClienteExistente(): void {
    const cliente = this.clienteFormulario();

    if (
      !cliente ||
      !/^\d{9}$/.test(cliente.telefono) ||
      !cliente.correo.trim()
    ) return;

    this.clientes.actualizarCliente(cliente).subscribe({
      next: actualizado => {
        if (!actualizado) return;

        this.clienteEncontrado.set({ ...cliente });
        this.clienteListo.emit({ ...cliente });
      }
    });
  }
}
