import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';

export const AuthResolver: ResolveFn<boolean> = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);
  try {
    const isAuthenticated = jwtService.isAuthenticated();

    if (!isAuthenticated) {
      router.navigate(['sign-in']);
    }

    return of(isAuthenticated);
  } catch (error) {
    router.navigate(['sign-in']).then(() => {
      alert('Token is expired or invalid');
    });

    // Returning throwError to ensure the error is propagated
    return throwError(() => error);
  }
};
