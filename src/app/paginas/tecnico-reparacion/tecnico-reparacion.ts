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
  mostrarDecisionDiagnostico = signal(false);
  mostrarFormularioRepuestos = signal(false);
  mostrarFormularioFinalizacion = signal(false);
  repuestosRegistrados = signal(false);
  reparacionFinalizada = signal(false);
  cargando = signal(true);

  constructor() {
    this.cargarReparacion();
  }

  private actualizarEtapa(pedido: Reparacion): void {
    if (
      pedido.estado === 'Listo para recojo' ||
      pedido.estado === 'Terminado'
    ) {
      this.etapaActual.set(3);
    } else if (pedido.diagnostico?.trim()) {
      this.etapaActual.set(2);
    } else {
      this.etapaActual.set(1);
    }
  }

  private cargarReparacion(): void {
    const codigo = this.codigoAtencion;

    if (!codigo) {
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);

    this.reparaciones.buscarPorCodigo(codigo).subscribe(pedido => {
      this.reparacion.set(pedido);

      if (!pedido) {
        this.cliente.set(null);
        this.cargando.set(false);
        return;
      }

      this.actualizarEtapa(pedido);

      this.reparaciones.buscarClientePorDni(pedido.dniCliente)
        .subscribe(cliente => {
          if (this.reparacion()?.codigoAtencion === pedido.codigoAtencion) {
            this.cliente.set(cliente);
          }
        });

      if (pedido.estado === 'En espera') {
        this.reparaciones.marcarComoExaminando(codigo).subscribe(actualizado => {
          if (actualizado) {
            this.reparaciones.buscarPorCodigo(codigo).subscribe(pedidoActualizado => {
              if (pedidoActualizado) {
                this.reparacion.set(pedidoActualizado);
                this.actualizarEtapa(pedidoActualizado);
              }
              this.cargando.set(false);
            });
          } else {
            this.cargando.set(false);
          }
        });
      } else {
        this.cargando.set(false);
      }
    });
  }

  guardarDiagnostico(diagnostico: string): void {
    const dni = this.dniTecnico();
    const codigo = this.codigoAtencion;

    if (!codigo || !dni) return;

    this.reparaciones.guardarDiagnostico(codigo, dni, diagnostico)
      .subscribe(actualizado => {
        if (actualizado) {
          this.mostrarDecisionDiagnostico.set(true);
          this.cargarReparacion();
        }
      });
  }

  abrirFormularioRepuestos(): void {
    this.mostrarFormularioRepuestos.set(true);
  }

  cancelarFormularioRepuestos(): void {
    this.mostrarFormularioRepuestos.set(false);
  }

  abrirFormularioFinalizacion(): void {
    this.mostrarFormularioFinalizacion.set(true);
    this.mostrarDecisionDiagnostico.set(false);
  }

  volverDecision(): void {
    this.mostrarFormularioFinalizacion.set(false);
    this.mostrarDecisionDiagnostico.set(true);
  }

  guardarRepuestos(observaciones: string): void {
    const dni = this.dniTecnico();
    const codigo = this.codigoAtencion;

    if (!codigo || !dni) return;

    this.reparaciones.guardarRepuestos(codigo, dni, observaciones)
      .subscribe(actualizado => {
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
  }): void {
    const dni = this.dniTecnico();
    const codigo = this.codigoAtencion;

    if (!codigo || !dni) return;

    this.reparaciones.finalizarReparacion(
      codigo,
      dni,
      datos.solucionRealizada,
      datos.pruebasRealizadas
    ).subscribe(actualizado => {
      if (actualizado) {
        this.reparacionFinalizada.set(true);
        this.cargarReparacion();
      }
    });
  }

  volverPanel(): void {
    this.router.navigate(['/tecnico']);
  }
}
