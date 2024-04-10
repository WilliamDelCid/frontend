import { CanActivateFn } from '@angular/router';

export const LoginGuard: CanActivateFn = (route, state) => {
  return true;
};
