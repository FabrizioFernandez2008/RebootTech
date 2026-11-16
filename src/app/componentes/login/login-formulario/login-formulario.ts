import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Autenticacion } from '../../../servicios/autenticacion';

@Component({
  selector: 'app-login-formulario',
  imports: [FormsModule],
  templateUrl: './login-formulario.html',
  styleUrl: './login-formulario.css',
})
export class LoginFormulario {

  private router = inject(Router);
  private autenticacion = inject(Autenticacion);

  usuario = '';
  contrasena = '';
  mensajeError = signal('');

  iniciarSesion(): void {
    this.autenticacion.iniciarSesion(
      this.usuario,
      this.contrasena
    ).subscribe({
      next: sesionIniciada => {
        if (!sesionIniciada) {
          this.mensajeError.set(
            'Usuario o contraseña incorrectos, o cuenta inactiva.'
          );
          return;
        }

        this.mensajeError.set('');

        const trabajador = this.autenticacion.usuarioActual();

        switch (trabajador?.rol) {
          case 'recepcionista':
            this.router.navigate(['/recepcion']);
            break;

          case 'administrador':
            this.router.navigate(['/administrador']);
            break;

          case 'tecnico':
            this.router.navigate(['/tecnico']);
            break;
        }
      },
      error: () => {
        this.mensajeError.set('Ocurrió un error al iniciar sesión.');
      }
    });
  }
}
