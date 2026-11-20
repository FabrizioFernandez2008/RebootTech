import { Component, input, output } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';

@Component({
  selector: 'app-tecnico-pedidos-asignados',
  imports: [],
  templateUrl: './tecnico-pedidos-asignados.html',
  styleUrl: './tecnico-pedidos-asignados.css',
})
export class TecnicoPedidosAsignados {

  pedidos = input<Reparacion[]>([]);
  cargando = input(false);
  codigoCargando = input<string | null>(null);

  empezar = output<Reparacion>();

}
