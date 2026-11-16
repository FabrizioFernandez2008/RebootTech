import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Trabajador } from '../../../modelos/trabajadores';
import { Trabajadores } from '../../../servicios/trabajadores';
import { Autenticacion } from '../../../servicios/autenticacion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-administrador-trabajadores',
  imports: [FormsModule],
  templateUrl: './administrador-trabajadores.html',
  styleUrl: './administrador-trabajadores.css',
})
export class AdministradorTrabajadores {

  private servicioTrabajadores = inject(Trabajadores);
  private autenticacion = inject(Autenticacion);

  textoBusqueda = signal('');

  trabajadores = signal<Trabajador[]>([]);

  mostrarModal = signal(false);
  trabajadorEditando = signal<string | null>(null);

  usuarioActual = computed(() =>
    this.autenticacion.usuarioActual()?.usuario ?? ''
  );

  formulario = signal({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    usuario: '',
    rol: 'tecnico',
    contrasena: ''
  });

  dniDuplicado = signal(false);
  usuarioDuplicado = signal(false);
  requiereContrasena = signal(false);

  permisos = signal<Record<string, {
    desactivar: boolean;
    eliminar: boolean;
  }>>({});

  nombresValidos(): boolean {
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(
      this.formulario().nombres.trim()
    );
  }

  apellidosValidos(): boolean {
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(
      this.formulario().apellidos.trim()
    );
  }

  formularioValido = computed(() => {
    const f = this.formulario();
    const dniOriginal = this.trabajadorEditando();
    const editando = dniOriginal !== null;

    const nombresValidos =
      /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(f.nombres.trim());

    const apellidosValidos =
      /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(f.apellidos.trim());

    const usuarioValido = /^[a-zA-Z0-9._-]+$/.test(f.usuario.trim());

    const contrasenaValida = editando && !this.requiereContrasena()
      ? (!f.contrasena || f.contrasena.length >= 8)
      : f.contrasena.length >= 8;

    return (
      /^\d{8}$/.test(f.dni) &&
      (!editando || f.dni === dniOriginal) &&
      /^\d{9}$/.test(f.telefono) &&
      nombresValidos &&
      apellidosValidos &&
      f.direccion.trim().length > 0 &&
      usuarioValido &&
      ['administrador', 'recepcionista', 'tecnico'].includes(f.rol) &&
      contrasenaValida &&
      !this.dniDuplicado() &&
      !this.usuarioDuplicado()
    );
  });

  trabajadoresFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();

    if (!texto) return this.trabajadores();

    return this.trabajadores().filter(trabajador =>
      trabajador.dni.includes(texto) ||
      trabajador.nombres.toLowerCase().includes(texto) ||
      trabajador.apellidos.toLowerCase().includes(texto)
    );
  });

  constructor() {
    effect(onCleanup => {
      const suscripcion = this.servicioTrabajadores
        .obtenerTrabajadores()
        .subscribe(trabajadores => this.trabajadores.set(trabajadores));

      onCleanup(() => suscripcion.unsubscribe());
    });

    effect(onCleanup => {
      const formulario = this.formulario();
      const dniOriginal = this.trabajadorEditando();
      const suscripciones: Subscription[] = [];

      const suscripcionDni = this.servicioTrabajadores
        .dniDuplicado(formulario.dni, dniOriginal)
        .subscribe(resultado => this.dniDuplicado.set(resultado));

      const suscripcionUsuario = this.servicioTrabajadores
        .usuarioDuplicado(formulario.usuario, dniOriginal)
        .subscribe(resultado => this.usuarioDuplicado.set(resultado));

      suscripciones.push(suscripcionDni, suscripcionUsuario);

      if (dniOriginal) {
        const suscripcionTrabajador = this.servicioTrabajadores
          .buscarPorDni(dniOriginal)
          .subscribe(trabajador => {
            if (!trabajador) {
              this.requiereContrasena.set(false);
              return;
            }

            const suscripcionCredencial = this.servicioTrabajadores
              .tieneCredencial(trabajador.usuario)
              .subscribe(tieneCredencial => {
                this.requiereContrasena.set(!tieneCredencial);
              });

            suscripciones.push(suscripcionCredencial);
          });

        suscripciones.push(suscripcionTrabajador);
      } else {
        this.requiereContrasena.set(false);
      }

      onCleanup(() => {
        suscripciones.forEach(suscripcion => suscripcion.unsubscribe());
      });
    });

    effect(onCleanup => {
      const trabajadores = this.trabajadores();
      const usuarioActual = this.usuarioActual();
      const suscripciones: Subscription[] = [];

      this.permisos.set({});

      trabajadores.forEach(trabajador => {
        const suscripcionDesactivar = this.servicioTrabajadores
          .puedeDesactivar(trabajador, usuarioActual)
          .subscribe(desactivar => {
            this.permisos.update(permisos => ({
              ...permisos,
              [trabajador.dni]: {
                ...permisos[trabajador.dni],
                desactivar
              }
            }));
          });

        const suscripcionEliminar = this.servicioTrabajadores
          .puedeEliminar(trabajador, usuarioActual)
          .subscribe(eliminar => {
            this.permisos.update(permisos => ({
              ...permisos,
              [trabajador.dni]: {
                ...permisos[trabajador.dni],
                eliminar
              }
            }));
          });

        suscripciones.push(suscripcionDesactivar, suscripcionEliminar);
      });

      onCleanup(() => {
        suscripciones.forEach(suscripcion => suscripcion.unsubscribe());
      });
    });
  }

  puedeDesactivar(trabajador: Trabajador): boolean {
    return this.permisos()[trabajador.dni]?.desactivar ?? false;
  }

  desactivarTrabajador(trabajador: Trabajador) {
    if (!this.puedeDesactivar(trabajador)) return;

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas desactivar a ${trabajador.nombres} ${trabajador.apellidos}?`
    );

    if (!confirmado) return;

    this.servicioTrabajadores.desactivarTrabajador(
      trabajador.dni,
      this.usuarioActual()
    ).subscribe(resultado => {
      if (resultado) {
        this.servicioTrabajadores.obtenerTrabajadores().subscribe(
          trabajadores => this.trabajadores.set(trabajadores)
        );
      }
    });
  }

  puedeEliminar(trabajador: Trabajador): boolean {
    return this.permisos()[trabajador.dni]?.eliminar ?? false;
  }

  eliminarTrabajador(trabajador: Trabajador) {
    if (!this.puedeEliminar(trabajador)) return;

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas eliminar definitivamente a ${trabajador.nombres} ${trabajador.apellidos}?`
    );

    if (!confirmado) return;

    this.servicioTrabajadores.eliminarTrabajador(
      trabajador.dni,
      this.usuarioActual()
    ).subscribe(resultado => {
      if (resultado) {
        this.servicioTrabajadores.obtenerTrabajadores().subscribe(
          trabajadores => this.trabajadores.set(trabajadores)
        );
      }
    });
  }

  abrirModal(trabajador?: Trabajador) {
    if (trabajador) {
      this.trabajadorEditando.set(trabajador.dni);

      this.formulario.set({
        dni: trabajador.dni,
        nombres: trabajador.nombres,
        apellidos: trabajador.apellidos,
        telefono: trabajador.telefono,
        direccion: trabajador.direccion,
        usuario: trabajador.usuario,
        rol: trabajador.rol,
        contrasena: ''
      });
    } else {
      this.trabajadorEditando.set(null);

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

  actualizarCampo(campo: string, valor: string) {
    this.formulario.update(formulario => ({
      ...formulario,
      [campo]: valor
    }));
  }

  guardarTrabajador() {
    if (!this.formularioValido()) return;

    const formulario = this.formulario();
    const dniOriginal = this.trabajadorEditando();

    const trabajadorAnterior = dniOriginal
      ? this.trabajadores().find(actual => actual.dni === dniOriginal) ?? null
      : null;

    const trabajador: Trabajador = {
      dni: formulario.dni,
      nombres: formulario.nombres.trim(),
      apellidos: formulario.apellidos.trim(),
      telefono: formulario.telefono,
      direccion: formulario.direccion.trim(),
      usuario: formulario.usuario.trim(),
      rol: formulario.rol,
      estado: trabajadorAnterior ? trabajadorAnterior.estado : true
    };

    this.servicioTrabajadores.guardarTrabajador(
      trabajador,
      dniOriginal,
      formulario.contrasena
    ).subscribe(guardado => {
      if (!guardado) return;

      this.servicioTrabajadores.obtenerTrabajadores().subscribe(
        trabajadores => this.trabajadores.set(trabajadores)
      );

      this.cerrarModal();
    });
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.trabajadorEditando.set(null);
    this.requiereContrasena.set(false);
  }
}
