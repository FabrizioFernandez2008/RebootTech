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

  actualizarProblema(event: Event): void {
    this.problema.set((event.target as HTMLTextAreaElement).value);
  }

  actualizarRepuesto(event: Event): void {
    this.repuesto.set((event.target as HTMLInputElement).value);
  }

  actualizarPrecio(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.precio.set(valor === '' ? null : Number(valor));
  }

  guardar(): void {
    if (!this.formularioValido()) return;

    const precio = this.precio();

    if (precio === null) return;

    const observaciones =
      `Se requiere reemplazar ${this.problema().trim()}. ` +
      `Se recomienda ${this.repuesto().trim()}. ` +
      `Costo S/${precio.toFixed(2)}.`;

    this.guardarRepuestos.emit(observaciones);
  }
}
