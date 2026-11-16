import { Component, Output, EventEmitter, signal, computed } from '@angular/core';

@Component({
  selector: 'app-tecnico-reparacion-repuestos',
  imports: [],
  templateUrl: './tecnico-reparacion-repuestos.html',
  styleUrl: './tecnico-reparacion-repuestos.css',
})
export class TecnicoReparacionRepuestos {

  @Output() guardarRepuestos = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  problema = signal('');
  repuesto = signal('');
  precio = signal<number | null>(null);

  formularioValido = computed(() =>
    this.problema().trim().length > 0 &&
    this.repuesto().trim().length > 0 &&
    (this.precio() ?? 0) > 0
  );

  actualizarProblema(event: Event) {
    this.problema.set((event.target as HTMLTextAreaElement).value);
  }

  actualizarRepuesto(event: Event) {
    this.repuesto.set((event.target as HTMLInputElement).value);
  }

  actualizarPrecio(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.precio.set(valor === '' ? null : Number(valor));
  }

  guardar() {
    if (!this.formularioValido()) return;

    const observaciones =
      `Se requiere reemplazar ${this.problema().trim()}. ` +
      `Se recomienda ${this.repuesto().trim()}. ` +
      `Costo S/${this.precio()!.toFixed(2)}.`;

    this.guardarRepuestos.emit(observaciones);
  }
}
