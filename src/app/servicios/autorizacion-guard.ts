import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacion } from './autenticacion';
import { map, switchMap, of } from 'rxjs';

export const autorizacionGuard: CanActivateFn = (route) => {

  const autenticacion = inject(Autenticacion);
  const router = inject(Router);

  const rolRequerido = route.data['rol'];

  return autenticacion.estaAutenticado().pipe(
    switchMap(autenticado => {
      if (!autenticado) {
        return of(router.createUrlTree(['/login']));
      }

      return autenticacion.tieneRol(rolRequerido).pipe(
        map(tieneRol => {
          if (tieneRol) return true;

          const rolActual = autenticacion.usuarioActual()?.rol;

          switch (rolActual) {
            case 'administrador':
              return router.createUrlTree(['/administrador']);

            case 'recepcionista':
              return router.createUrlTree(['/recepcion']);

            case 'tecnico':
              return router.createUrlTree(['/tecnico']);

            default:
              return router.createUrlTree(['/login']);
          }
        })
      );
    })
  );
};

export const loginGuard: CanActivateFn = () => {

  const autenticacion = inject(Autenticacion);
  const router = inject(Router);

  return autenticacion.estaAutenticado().pipe(
    map(autenticado => {
      if (!autenticado) return true;

      const rolActual = autenticacion.usuarioActual()?.rol;

      switch (rolActual) {
        case 'administrador':
          return router.createUrlTree(['/administrador']);

        case 'recepcionista':
          return router.createUrlTree(['/recepcion']);

        case 'tecnico':
          return router.createUrlTree(['/tecnico']);

        default:
          return router.createUrlTree(['/']);
      }
    })
  );
};
