import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { HomePage } from './pages/home-page/home-page';
import { authGuard, guestGuard } from './core/auth.guards';

export const routes: Routes = [
  // Only for people who are NOT logged in
  { path: 'login', component: AuthPage, data: { mode: 'login' }, canActivate: [guestGuard] },
  { path: 'signup', component: AuthPage, data: { mode: 'signup' }, canActivate: [guestGuard] },

  // Only for people who ARE logged in
  { path: '', component: HomePage, canActivate: [authGuard] },

  // Any unknown address goes home (which sends you to login if needed)
  { path: '**', redirectTo: '' },
];
