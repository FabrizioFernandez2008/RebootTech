import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Autenticacion } from '../../servicios/autenticacion';
import { Reparaciones } from '../../servicios/reparaciones';
import { Reparacion } from '../../modelos/reparaciones';
import { Cliente } from '../../modelos/clientes';
import { Footer } from '../../componentes/footer/footer';
import { TecnicoEncabezado } from '../../componentes/tecnico/tecnico-encabezado/tecnico-encabezado';
import { TecnicoReparacionEtapas } from '../../componentes/tecnico/tecnico-reparacion-etapas/tecnico-reparacion-etapas';
import { TecnicoReparacionDiagnostico } from '../../componentes/tecnico/tecnico-reparacion-diagnostico/tecnico-reparacion-diagnostico';
import { TecnicoReparacionRepuestos } from '../../componentes/tecnico/tecnico-reparacion-repuestos/tecnico-reparacion-repuestos';
import { TecnicoReparacionFormulario } from '../../componentes/tecnico/tecnico-reparacion-formulario/tecnico-reparacion-formulario';

@Component({
  selector: 'app-tecnico-reparacion',
  imports: [
    Footer,
    TecnicoEncabezado,
    TecnicoReparacionEtapas,
    TecnicoReparacionDiagnostico,
    TecnicoReparacionRepuestos,
    TecnicoReparacionFormulario
  ],
  templateUrl: './tecnico-reparacion.html',
  styleUrl: './tecnico-reparacion.css',
})
export class TecnicoReparacion {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reparaciones = inject(Reparaciones);
  private autenticacion = inject(Autenticacion);

  codigoAtencion = this.route.snapshot.paramMap.get('codigoAtencion');

  dniTecnico = computed(() =>
    this.autenticacion.usuarioActual()?.dni ?? null
  );

  reparacion = signal<Reparacion | null>(null);
  cliente = signal<Cliente | null>(null);

  etapaActual = signal(1);

  mostrarFormularioRepuestos = signal(false);
  repuestosRegistrados = signal(false);
  reparacionFinalizada = signal(false);

  constructor() {
    if (this.codigoAtencion) {
      this.cargarReparacion();
    }
  }

  private cargarReparacion() {
    if (!this.codigoAtencion) return;

    this.reparaciones.buscarPorCodigo(
      this.codigoAtencion
    ).subscribe(pedido => {
      this.reparacion.set(pedido);

      if (!pedido) {
        this.cliente.set(null);
        return;
      }

      this.etapaActual.set(pedido.diagnostico ? 2 : 1);

      this.reparaciones.buscarClientePorDni(
        pedido.dniCliente
      ).subscribe(cliente => {
        if (
          this.reparacion()?.codigoAtencion === pedido.codigoAtencion
        ) {
          this.cliente.set(cliente);
        }
      });
    });
  }

  guardarDiagnostico(diagnostico: string) {
    const dni = this.dniTecnico();

    if (!this.codigoAtencion || !dni) return;

    this.reparaciones.guardarDiagnostico(
      this.codigoAtencion,
      dni,
      diagnostico
    ).subscribe(actualizado => {
      if (actualizado) {
        this.etapaActual.set(2);
        this.cargarReparacion();
      }
    });
  }

  abrirFormularioRepuestos() {
    this.mostrarFormularioRepuestos.set(true);
  }

  cancelarFormularioRepuestos() {
    this.mostrarFormularioRepuestos.set(false);
  }

  guardarRepuestos(observaciones: string) {
    const dni = this.dniTecnico();

    if (!this.codigoAtencion || !dni) return;

    this.reparaciones.guardarRepuestos(
      this.codigoAtencion,
      dni,
      observaciones
    ).subscribe(actualizado => {
      if (actualizado) {
        this.mostrarFormularioRepuestos.set(false);
        this.repuestosRegistrados.set(true);
        this.cargarReparacion();
      }
    });
  }

  finalizarReparacion(datos: {
    solucionRealizada: string;
    pruebasRealizadas: string;
  }) {
    const dni = this.dniTecnico();

    if (!this.codigoAtencion || !dni) return;

    this.reparaciones.finalizarReparacion(
      this.codigoAtencion,
      dni,
      datos.solucionRealizada,
      datos.pruebasRealizadas
    ).subscribe(actualizado => {
      if (actualizado) {
        this.etapaActual.set(3);
        this.reparacionFinalizada.set(true);
        this.cargarReparacion();
      }
    });
  }

  volverPanel() {
    this.router.navigate(['/tecnico']);
  }
}
