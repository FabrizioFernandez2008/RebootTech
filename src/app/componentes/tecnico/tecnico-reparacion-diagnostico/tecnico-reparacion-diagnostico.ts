import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-tecnico-reparacion-diagnostico',
  imports: [],
  templateUrl: './tecnico-reparacion-diagnostico.html',
  styleUrl: './tecnico-reparacion-diagnostico.css',
})
export class TecnicoReparacionDiagnostico {

  @Input() reparacion: Reparacion | null = null;
  @Input() cliente: Cliente | null = null;

  @Output() guardarDiagnostico = new EventEmitter<string>();
  @Output() solicitarRepuestos = new EventEmitter<void>();

  diagnostico = signal('');

  actualizarDiagnostico(event: Event) {
    this.diagnostico.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  continuar() {
    if (!this.diagnostico().trim()) return;

    this.guardarDiagnostico.emit(this.diagnostico().trim());
  }

}
