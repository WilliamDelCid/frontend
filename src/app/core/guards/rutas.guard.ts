import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const rutaGuard: CanActivateFn = async (route, state) => {
  return false;
};
