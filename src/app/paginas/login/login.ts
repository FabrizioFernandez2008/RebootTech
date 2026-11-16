import { Component } from '@angular/core';
import { LoginEncabezado } from '../../componentes/login/login-encabezado/login-encabezado';
import { LoginFormulario } from '../../componentes/login/login-formulario/login-formulario';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-login',
  imports: [LoginEncabezado, LoginFormulario, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}