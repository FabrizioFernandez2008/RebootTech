import { Component, Input } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';

@Component({
  selector: 'app-consultar-resultado',
  imports: [],
  templateUrl: './consultar-resultado.html',
  styleUrl: './consultar-resultado.css',
})
export class ConsultarResultado {

  @Input() reparacion: Reparacion | null = null;

  mensajesEstado: Record<string, string> = {
    'En espera': 'Tu equipo será revisado pronto.',
    'Examinando': 'Nuestro técnico está revisando tu equipo.',
    'Reparando': 'Tu equipo se encuentra en reparación. Nos comunicaremos contigo cuando terminemos.',
    'Esperando confirmación': 'Se requiere tu autorización para continuar con la reparación. Nos comunicaremos contigo muy pronto.',
    'Listo para recojo': 'Tu equipo está listo para ser recogido.',
    'Terminado': 'El servicio ha finalizado. Gracias por confiar en nosotros.',
    'Cancelado': 'El servicio ha sido cancelado.'
  };

}
