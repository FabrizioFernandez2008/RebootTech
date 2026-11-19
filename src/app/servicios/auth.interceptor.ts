import { HttpInterceptorFn } from '@angular/common/http';
import { TOKEN_KEY } from '../api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (!token) {
    return next(req);
  }

  const solicitud = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(solicitud);
};