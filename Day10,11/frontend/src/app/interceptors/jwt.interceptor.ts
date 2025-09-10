import { HttpInterceptorFn } from '@angular/common/http';

export class jwtInterceptor {
  static withToken: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next(req);
  };
}
