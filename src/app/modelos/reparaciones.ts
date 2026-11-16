export interface Reparacion {
  codigoAtencion: string;
  dniCliente: string;
  tipoEquipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  accesorios: string | null;
  problemaReportado: string;
  observaciones: string | null;
  fechaIngreso: string;
  fechaFinalizacion?: string | null;
  estado: string;
  dniTecnico: string | null;
  diagnostico?: string;
  repuestoNecesario?: string | null;
  precioRepuesto?: number | null;
  problemaRepuesto?: string | null;
  solucionRealizada?: string;
  pruebasRealizadas?: string;
}

export interface DatosReparacion {
  tipoEquipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  accesorios: string | null;
  problemaReportado: string;
  observaciones: string | null;
}
