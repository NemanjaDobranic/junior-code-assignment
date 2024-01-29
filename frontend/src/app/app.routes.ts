import { Routes } from '@angular/router';
import { AuthResolver } from './resolvers/auth.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    resolve: [AuthResolver],
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (m) => m.SignInComponent
      ),
  },
];
