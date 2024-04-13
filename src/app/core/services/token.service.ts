import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';
import { AuthService } from './auth.service';
const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  private router = inject(Router);
  private authService = inject(AuthService);

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) ?? '';
  }

  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  //! validar Token
  validarToken(): Observable<boolean> {
    return this.authService.refresh(new JwtDTO(this.getToken())).pipe(
      map((resp: JwtDTO) => {
        if (resp.token !== null) {
        }
        return true;
      }),
      catchError(() => of(false)),
    );
  }

  public getUserName(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const payload = token.split('.')[1];

    try {
      const payloadDecoded = decodeURIComponent(escape(atob(payload)));
      const values = JSON.parse(payloadDecoded);
      const username = values.sub;
      return username;
    } catch (error) {
      this.cleanLocalStorage();
      return '';
    }
  }

  public cleanLocalStorage() {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  public getRoles(): string[] {
    if (!this.isLogged()) {
      return [];
    }
    const token = this.getToken();
    const payload = token.split('.')[1];

    try {
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const AllRoles = values.roles;
      const roles = AllRoles.map((role: string) => role.replace('ROLE_', ''));
      return roles;
    } catch (error) {
      this.cleanLocalStorage();
      return [];
    }
  }



  public logOut(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/']);
  }
}
