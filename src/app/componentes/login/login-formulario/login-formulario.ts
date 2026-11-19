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
    this.mensajeError.set('');

    this.autenticacion.iniciarSesion(this.usuario, this.contrasena).subscribe({
      next: trabajador => {
        switch (trabajador.rol.toUpperCase()) {
          case 'RECEPCIONISTA':
            this.router.navigate(['/recepcion']);
            break;

          case 'ADMINISTRADOR':
            this.router.navigate(['/administrador']);
            break;

          case 'TECNICO':
            this.router.navigate(['/tecnico']);
            break;

          default:
            this.autenticacion.cerrarSesion().subscribe();
            this.mensajeError.set('El usuario no tiene un rol válido.');
        }
      },
      error: error => {
        if (error.status === 401 || error.status === 403) {
          this.mensajeError.set(
            'Usuario o contraseña incorrectos, o cuenta inactiva.'
          );
        } else {
          this.mensajeError.set(
            'No se pudo conectar con el servidor. Inténtalo nuevamente.'
          );
        }
      }
    });
  }
}