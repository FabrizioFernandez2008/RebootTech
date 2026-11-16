import { Component, Output, EventEmitter, signal, computed } from '@angular/core';

@Component({
  selector: 'app-tecnico-reparacion-formulario',
  imports: [],
  templateUrl: './tecnico-reparacion-formulario.html',
  styleUrl: './tecnico-reparacion-formulario.css',
})
export class TecnicoReparacionFormulario {

  @Output() guardarReparacion = new EventEmitter<{
    solucionRealizada: string;
    pruebasRealizadas: string;
  }>();

  solucionRealizada = signal('');
  pruebasRealizadas = signal('');

  formularioValido = computed(() =>
    this.solucionRealizada().trim().length > 0 &&
    this.pruebasRealizadas().trim().length > 0
  );

  actualizarSolucion(event: Event) {
    this.solucionRealizada.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  actualizarPruebas(event: Event) {
    this.pruebasRealizadas.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  continuar() {
    if (!this.formularioValido()) return;

    this.guardarReparacion.emit({
      solucionRealizada: this.solucionRealizada().trim(),
      pruebasRealizadas: this.pruebasRealizadas().trim()
    });
  }
}
