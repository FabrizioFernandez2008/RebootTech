export interface TrabajadorSesion {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  usuario: string;
  rol: string;
  estado: boolean;
}

export interface InicioSesionDTO {
  usuario: string;
  contrasena: string;
}

export interface InicioSesionRespuesta {
  token: string;
  tipo: string;
  trabajador: TrabajadorSesion;
}