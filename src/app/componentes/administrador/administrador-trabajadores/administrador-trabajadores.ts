import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trabajadores } from '../../../servicios/trabajadores';
import { Autenticacion } from '../../../servicios/autenticacion';
import { Trabajador } from '../../../modelos/trabajadores';

interface FormularioTrabajador {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  usuario: string;
  rol: string;
  contrasena: string;
}

@Component({
  selector: 'app-administrador-trabajadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administrador-trabajadores.html',
  styleUrl: './administrador-trabajadores.css'
})

export class AdministradorTrabajadores {
  private trabajadoresServicio = inject(Trabajadores);
  private autenticacion = inject(Autenticacion);

  textoBusqueda = signal('');
  trabajadores = signal<Trabajador[]>([]);
  mostrarModal = signal(false);
  trabajadorEditando = signal<Trabajador | null>(null);
  errorOperacion = signal('');

  formulario = signal<FormularioTrabajador>({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    usuario: '',
    rol: 'tecnico',
    contrasena: ''
  });

  usuarioActual = computed(
    () => this.autenticacion.usuarioActual()?.usuario ?? ''
  );

  trabajadoresFiltrados = computed(() => {
    const busqueda = this.textoBusqueda().trim().toLowerCase();

    if (!busqueda) {
      return this.trabajadores();
    }

    return this.trabajadores().filter(trabajador =>
      trabajador.dni.toLowerCase().includes(busqueda) ||
      trabajador.nombres.toLowerCase().includes(busqueda) ||
      trabajador.apellidos.toLowerCase().includes(busqueda)
    );
  });

  dniDuplicado = computed(() => {
    const dni = this.formulario().dni;
    const dniOriginal = this.trabajadorEditando()?.dni;

    return this.trabajadores().some(
      trabajador =>
        trabajador.dni === dni &&
        trabajador.dni !== dniOriginal
    );
  });

  usuarioDuplicado = computed(() => {
    const usuario = this.formulario().usuario.trim().toLowerCase();
    const dniOriginal = this.trabajadorEditando()?.dni;

    return this.trabajadores().some(
      trabajador =>
        trabajador.usuario.toLowerCase() === usuario &&
        trabajador.dni !== dniOriginal
    );
  });

  nombresValidos = computed(() =>
    /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(this.formulario().nombres)
  );

  apellidosValidos = computed(() =>
    /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(this.formulario().apellidos)
  );

  formularioValido = computed(() => {
    const datos = this.formulario();
    const editando = this.trabajadorEditando() !== null;

    const dniValido = /^\d{8}$/.test(datos.dni);
    const telefonoValido = /^\d{9}$/.test(datos.telefono);
    const nombresValidos = this.nombresValidos();
    const apellidosValidos = this.apellidosValidos();
    const direccionValida = datos.direccion.trim().length > 0;
    const usuarioValido = /^[a-zA-Z0-9._-]{3,50}$/.test(datos.usuario);
    const rolValido = ['administrador', 'recepcionista', 'tecnico'].includes(datos.rol);
    const contrasenaValida = editando
      ? datos.contrasena.length === 0 || datos.contrasena.length >= 8
      : datos.contrasena.length >= 8;

    const dniSinCambios = !editando ||
      datos.dni === this.trabajadorEditando()?.dni;

    return dniValido &&
      dniSinCambios &&
      !this.dniDuplicado() &&
      telefonoValido &&
      nombresValidos &&
      apellidosValidos &&
      direccionValida &&
      usuarioValido &&
      !this.usuarioDuplicado() &&
      rolValido &&
      contrasenaValida;
  });

  constructor() {
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.trabajadoresServicio.obtenerTrabajadores().subscribe({
      next: trabajadores => this.trabajadores.set(trabajadores),
      error: () => {
        this.errorOperacion.set('No fue posible cargar los trabajadores.');
      }
    });
  }

  actualizarCampo(campo: keyof FormularioTrabajador, valor: string): void {
    this.formulario.update(datos => ({
      ...datos,
      [campo]: valor
    }));

    this.errorOperacion.set('');
  }

  abrirModal(trabajador?: Trabajador): void {
    this.errorOperacion.set('');
    this.trabajadorEditando.set(trabajador ?? null);

    if (trabajador) {
      this.formulario.set({
        dni: trabajador.dni,
        nombres: trabajador.nombres,
        apellidos: trabajador.apellidos,
        telefono: trabajador.telefono,
        direccion: trabajador.direccion,
        usuario: trabajador.usuario,
        rol: trabajador.rol.toLowerCase(),
        contrasena: ''
      });
    } else {
      this.formulario.set({
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        direccion: '',
        usuario: '',
        rol: 'tecnico',
        contrasena: ''
      });
    }

    this.mostrarModal.set(true);
  }

  puedeDesactivar(trabajador: Trabajador): boolean {
    if (
      !trabajador.estado ||
      trabajador.usuario.toLowerCase() === this.usuarioActual().toLowerCase()
    ) {
      return false;
    }

    if (trabajador.rol.toLowerCase() === 'administrador') {
      const administradoresActivos = this.trabajadores().filter(
        elemento =>
          elemento.rol.toLowerCase() === 'administrador' &&
          elemento.estado
      );

      return administradoresActivos.length > 1;
    }

    return true;
  }

  puedeCambiarEstado(trabajador: Trabajador): boolean {
    if (trabajador.usuario.toLowerCase() === this.usuarioActual().toLowerCase()) {
      return false;
    }

    return trabajador.estado
      ? this.puedeDesactivar(trabajador)
      : true;
  }

  puedeEliminar(trabajador: Trabajador): boolean {
    if (trabajador.usuario.toLowerCase() === this.usuarioActual().toLowerCase()) {
      return false;
    }

    if (
      trabajador.estado &&
      trabajador.rol.toLowerCase() === 'administrador'
    ) {
      const administradoresActivos = this.trabajadores().filter(
        elemento =>
          elemento.rol.toLowerCase() === 'administrador' &&
          elemento.estado
      );

      return administradoresActivos.length > 1;
    }

    return true;
  }

  cambiarEstadoTrabajador(trabajador: Trabajador): void {
    if (!this.puedeCambiarEstado(trabajador)) {
      return;
    }

    const activar = !trabajador.estado;
    const accion = activar ? 'activar' : 'desactivar';

    const confirmar = window.confirm(
      `¿Deseas ${accion} la cuenta de ${trabajador.nombres} ${trabajador.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    const solicitud = activar
      ? this.trabajadoresServicio.activarTrabajador(trabajador.dni)
      : this.trabajadoresServicio.desactivarTrabajador(
          trabajador.dni,
          this.usuarioActual()
        );

    solicitud.subscribe({
      next: resultado => {
        if (resultado) {
          this.cargarTrabajadores();
        } else {
          window.alert(`No fue posible ${accion} la cuenta del trabajador.`);
        }
      },
      error: () => {
        window.alert(`Ocurrió un error al ${accion} la cuenta del trabajador.`);
      }
    });
  }

  eliminarTrabajador(trabajador: Trabajador): void {
    if (!this.puedeEliminar(trabajador)) {
      return;
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar permanentemente al trabajador ${trabajador.nombres} ${trabajador.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    this.trabajadoresServicio.eliminarTrabajador(
      trabajador.dni,
      this.usuarioActual()
    ).subscribe({
      next: resultado => {
        if (resultado) {
          this.cargarTrabajadores();
        } else {
          window.alert(
            'No fue posible eliminar al trabajador. Puede tener reparaciones asociadas o existir una restricción administrativa.'
          );
        }
      },
      error: () => {
        window.alert('Ocurrió un error al eliminar al trabajador.');
      }
    });
  }

  guardarTrabajador(): void {
    if (!this.formularioValido()) {
      return;
    }

    const datos = this.formulario();
    const trabajadorAnterior = this.trabajadorEditando();

    const trabajador: Trabajador = {
      dni: datos.dni.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      telefono: datos.telefono.trim(),
      direccion: datos.direccion.trim(),
      usuario: datos.usuario.trim(),
      rol: datos.rol,
      estado: trabajadorAnterior?.estado ?? true
    };

    this.trabajadoresServicio.guardarTrabajador(
      trabajador,
      trabajadorAnterior?.dni ?? null,
      datos.contrasena
    ).subscribe({
      next: () => {
        this.cargarTrabajadores();
        this.cerrarModal();
      },
      error: error => {
        const mensaje = error.error?.mensaje;

        this.errorOperacion.set(
          mensaje || 'No fue posible guardar los datos del trabajador. Verifica que el DNI y el usuario no estén registrados.'
        );
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.trabajadorEditando.set(null);
    this.errorOperacion.set('');
  }
}