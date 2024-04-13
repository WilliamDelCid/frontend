import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const rutaGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() !== '') {
    try {
      const resp = await tokenService.validarToken().toPromise();
      if (resp) {
        const expectedAuthorities = route.data['expectedRol'];
        const roles = tokenService.getRoles();
        if (roles[0] === 'ADMINISTRADOR') {
          return true;
        }
        if (!expectedAuthorities) {
          router.navigate(['/inicio']);
          return false;
        }
        const hasExpectedAuthorities = expectedAuthorities.some(
          (authority: string) => roles.includes(authority)
        );
        if (!hasExpectedAuthorities) {
          router.navigate(['/inicio']);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  } else {
    tokenService.logOut();
    return false;
  }
};
