import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtDTOIN } from '../interfaces/Ijwt';
import { JwtDTO } from '../models/jwt-dto';
import { LoginUsuario } from '../models/login-usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';
const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURL = `${environment.urlAPI}auth/`;

  private http = inject(HttpClient);

  public nuevo(nuevoUsuario: NuevoUsuario) {
    return this.http.post(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTOIN> {
    window.sessionStorage.removeItem(TOKEN_KEY);

    return this.http.post<JwtDTOIN>(this.authURL + 'login', loginUsuario);
  }

  public refresh(dto: JwtDTO): Observable<JwtDTO> {
    return this.http.post<JwtDTO>(this.authURL + 'refresh', dto);
  }


}
