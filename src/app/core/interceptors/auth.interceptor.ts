import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { catchError, concatMap, throwError } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (!tokenService.isLogged()) {
    tokenService.logOut();
    return next(req);
  }

  const token = tokenService.getToken();
  let authReq = addToken(req, token);

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const dto: JwtDTO = new JwtDTO(tokenService.getToken());
        return authService.refresh(dto).pipe(
          concatMap((data: any) => {
            tokenService.setToken(data.token);
            authReq = addToken(req, data.token);
            return next(authReq);
          }),
        );
      } else if (err.status === 403) {
        Swal.close();
        tokenService.logOut();
        return throwError(err);
      }else if (err.status === 500) {
        Swal.close();
        tokenService.logOut();
        return throwError(err);
      }
      else if (err.status === 0) {
        Swal.close();
        tokenService.logOut();
        return throwError(err);
      }
      return throwError(err);
    }),
  );
};

function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
