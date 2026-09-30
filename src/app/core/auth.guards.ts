import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Pages that need a login: send everyone else to /login. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.loadCurrentUser()) ? true : router.createUrlTree(['/login']);
};

/** Login and sign-up pages: people already logged in go straight to the app. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.loadCurrentUser()) ? router.createUrlTree(['/']) : true;
};
