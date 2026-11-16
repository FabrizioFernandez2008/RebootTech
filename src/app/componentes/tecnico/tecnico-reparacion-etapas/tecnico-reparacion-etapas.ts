import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tecnico-reparacion-etapas',
  imports: [],
  templateUrl: './tecnico-reparacion-etapas.html',
  styleUrl: './tecnico-reparacion-etapas.css',
})
export class TecnicoReparacionEtapas {

  @Input() etapaActual = 1;

  etapas = [
    'Diagnóstico',
    'Reparación',
    'Finalizado'
  ];

}
