import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const LoginGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLogged()) {
    try {
      const resp = await tokenService.validarToken().toPromise();
      if (resp) {
        router.navigate(['/inicio']);
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  }
  return true;
};
