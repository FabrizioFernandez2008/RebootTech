import { Trabajador } from '../modelos/trabajadores';

export const TRABAJADORES: Trabajador[] = [
  {
    dni: '70123456',
    nombres: 'Roberto',
    apellidos: 'Sánchez',
    telefono: '987654321',
    direccion: 'Lima',
    usuario: 'admin',
    rol: 'administrador',
    estado: true
  },
  {
    dni: '70234567',
    nombres: 'Lucía',
    apellidos: 'Fernández',
    telefono: '987654322',
    direccion: 'Lima',
    usuario: 'recepcion',
    rol: 'recepcionista',
    estado: true
  },
  {
    dni: '70345678',
    nombres: 'Miguel',
    apellidos: 'Ramírez',
    telefono: '987654323',
    direccion: 'Lima',
    usuario: 'tecnico',
    rol: 'tecnico',
    estado: true
  }
];
