import { Component } from '@angular/core';
import { RecepcionEncabezado } from '../../componentes/recepcion/recepcion-encabezado/recepcion-encabezado';
import { RecepcionPedidos } from '../../componentes/recepcion/recepcion-pedidos/recepcion-pedidos';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-recepcion',
  imports: [RecepcionEncabezado, RecepcionPedidos, Footer],
  templateUrl: './recepcion.html',
  styleUrl: './recepcion.css',
})
export class Recepcion {}

