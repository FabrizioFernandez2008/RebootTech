import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';

@Component({
  selector: 'app-tecnico-pedidos-asignados',
  imports: [],
  templateUrl: './tecnico-pedidos-asignados.html',
  styleUrl: './tecnico-pedidos-asignados.css',
})
export class TecnicoPedidosAsignados {

  @Input() pedidos: Reparacion[] = [];

  @Output() empezar = new EventEmitter<Reparacion>();

}
