import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtPayload } from '../interfaces/jwt.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private _jwtService = inject(JwtHelperService);
  private _token = localStorage.getItem(environment.tokenKey) as string;

  get token() {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
    localStorage.setItem(environment.tokenKey, value);
  }

  get payload() {
    return this._jwtService.decodeToken<JwtPayload>(this._token as string);
  }

  public isAuthenticated(): boolean {
    return !this._jwtService.isTokenExpired(this.token);
  }
}
