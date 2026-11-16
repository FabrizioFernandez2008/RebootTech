import { Component } from '@angular/core';
import { PrincipalNavbar } from '../../componentes/principal/principal-navbar/principal-navbar';
import { PrincipalPresentacion } from '../../componentes/principal/principal-presentacion/principal-presentacion';
import { PrincipalServicios } from '../../componentes/principal/principal-servicios/principal-servicios';
import { PrincipalInformacion } from '../../componentes/principal/principal-informacion/principal-informacion';
import { Footer } from '../../componentes/footer/footer';


@Component({
  selector: 'app-principal',
  imports: [PrincipalNavbar, PrincipalPresentacion, PrincipalServicios, PrincipalInformacion, Footer],
  templateUrl: './principal.html',
  styleUrl: './principal.css'
})
export class Principal {}