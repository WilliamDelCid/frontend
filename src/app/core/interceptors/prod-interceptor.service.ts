import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable ,inject} from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, concatMap, throwError } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor{

  private tokenService = inject(TokenService);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {
    if (!this.tokenService.isLogged()) {
      this.tokenService.logOut();
      return next.handle(req);
    }
    let intReq = req;
    const token = this.tokenService.getToken();
    intReq = this.addToken(req, token);
    return next.handle(intReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const dto: JwtDTO = new JwtDTO(this.tokenService.getToken());
          return this.authService.refresh(dto).pipe(
            concatMap((data: any) => {
              this.tokenService.setToken(data.access_token);
              intReq = this.addToken(req, data.access_token);
              return next.handle(intReq);
            }),
          );
        } else if (err.status === 403) {
          Swal.close();
          this.tokenService.logOut();
          return throwError(err);
        } else if (err.status === 0) {
          Swal.close();
          this.tokenService.logOut();
          return throwError(err);
        }
        return throwError(err);
      }),
    );
  }

  private addToken(
    req: HttpRequest<object>,
    token: string,
  ): HttpRequest<object> {
    return req.clone({
      headers: req.headers
        .set('Authorization', 'Bearer ' + token)
    });
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true }];

