import { Component } from '@angular/core';
import { AdministradorEncabezado } from '../../componentes/administrador/administrador-encabezado/administrador-encabezado';
import { AdministradorResumen } from '../../componentes/administrador/administrador-resumen/administrador-resumen';
import { AdministradorBusqueda } from '../../componentes/administrador/administrador-busqueda/administrador-busqueda';
import { AdministradorTrabajadores } from '../../componentes/administrador/administrador-trabajadores/administrador-trabajadores';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-administrador',
  imports: [
    AdministradorEncabezado,
    AdministradorResumen,
    AdministradorBusqueda,
    AdministradorTrabajadores,
    Footer
  ],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css',
})
export class Administrador {}
