import { Routes } from '@angular/router';
import { autorizacionGuard, loginGuard } from './servicios/autorizacion-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./paginas/principal/principal')
      .then(m => m.Principal)
  },
 {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./paginas/login/login')
      .then(m => m.Login)
  },
  {
    path: 'recepcion',
    canActivate: [autorizacionGuard],
    data: { rol: 'recepcionista' },
    loadComponent: () => import('./paginas/recepcion/recepcion')
      .then(m => m.Recepcion)
  },
  {
    path: 'registrar-pedido',
    canActivate: [autorizacionGuard],
    data: { rol: 'recepcionista' },
    loadComponent: () => import('./paginas/registrar-pedido/registrar-pedido')
      .then(m => m.RegistrarPedido)
  },
  {
    path: 'administrador',
    canActivate: [autorizacionGuard],
    data: { rol: 'administrador' },
    loadComponent: () => import('./paginas/administrador/administrador')
      .then(m => m.Administrador)
  },
  {
    path: 'consultar-seguimiento',
    loadComponent: () => import('./paginas/consultar-seguimiento/consultar-seguimiento')
      .then(m => m.ConsultarSeguimiento)
  },
  {
    path: 'tecnico',
    canActivate: [autorizacionGuard],
    data: { rol: 'tecnico' },
    loadComponent: () => import('./paginas/tecnico/tecnico')
      .then(m => m.Tecnico)
  },
  {
    path: 'tecnico/reparacion/:codigoAtencion',
    canActivate: [autorizacionGuard],
    data: { rol: 'tecnico' },
    loadComponent: () =>
      import('./paginas/tecnico-reparacion/tecnico-reparacion')
        .then(m => m.TecnicoReparacion)
  }
];
