import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { JwtService } from './jwt.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class CustomHttpClientService {
  // services
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);
  private alertService = inject(AlertService);

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(environment.apiUrl + path, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
        params: params ? params : {},
      })
      .pipe(catchError(this.alertService.errorHandler.bind(this.alertService)));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http
      .post<T>(environment.apiUrl + path, body, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
      })
      .pipe(catchError(this.alertService.errorHandler.bind(this.alertService)));
  }

  patch<T>(path: string, params?: HttpParams, body?: any): Observable<T> {
    return this.http
      .patch<T>(environment.apiUrl + path, body, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
        params: params ? params : {},
      })
      .pipe(catchError(this.alertService.errorHandler.bind(this.alertService)));
  }

  delete<T>(path: string, params?: any, body?: any): Observable<T> {
    return this.http
      .delete<T>(environment.apiUrl + path, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
        body: body,
        params: params ? params : {},
      })
      .pipe(catchError(this.alertService.errorHandler.bind(this.alertService)));
  }
}
