import { Credencial } from '../modelos/credenciales';

export const CREDENCIALES: Credencial[] = [
  {
    usuario: 'admin',
    contrasena: 'Admin123',
    rol: 'administrador',
    estado: true
  },
  {
    usuario: 'recepcion',
    contrasena: 'Recep123',
    rol: 'recepcionista',
    estado: true
  },
  {
    usuario: 'tecnico',
    contrasena: 'Tec123',
    rol: 'tecnico',
    estado: true
  }
];