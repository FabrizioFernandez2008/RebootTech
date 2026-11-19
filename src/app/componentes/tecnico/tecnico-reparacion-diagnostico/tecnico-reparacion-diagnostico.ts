import { Component, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { Reparacion } from '../../../modelos/reparaciones';
import { Cliente } from '../../../modelos/clientes';

@Component({
  selector: 'app-tecnico-reparacion-diagnostico',
  imports: [],
  templateUrl: './tecnico-reparacion-diagnostico.html',
  styleUrl: './tecnico-reparacion-diagnostico.css',
})
export class TecnicoReparacionDiagnostico implements OnChanges {

  @Input() reparacion: Reparacion | null = null;
  @Input() cliente: Cliente | null = null;
  @Input() soloLectura = false;

  @Output() guardarDiagnostico = new EventEmitter<string>();

  diagnostico = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reparacion'] && this.reparacion) {
      this.diagnostico.set(this.reparacion.diagnostico ?? '');
    }
  }

  actualizarDiagnostico(event: Event): void {
    this.diagnostico.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  continuar(): void {
    if (!this.diagnostico().trim()) return;

    this.guardarDiagnostico.emit(this.diagnostico().trim());
  }
}