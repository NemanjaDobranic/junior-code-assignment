import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, finalize } from 'rxjs';
import { JwtService } from './jwt.service';
import { AlertService } from './alert.service';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class CustomHttpClientService {
  // services
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);
  private alertService = inject(AlertService);
  private spinnerService = inject(SpinnerService);

  get<T>(path: string, params?: HttpParams): Observable<T> {
    this.spinnerService.start();

    return this.http
      .get<T>(environment.apiUrl + path, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
        params: params ? params : {},
      })
      .pipe(
        catchError(this.alertService.errorHandler.bind(this.alertService)),
        finalize(() => this.spinnerService.stop())
      );
  }

  post<T>(path: string, body: any): Observable<T> {
    this.spinnerService.start();

    return this.http
      .post<T>(environment.apiUrl + path, body, {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.token,
        },
      })
      .pipe(
        catchError(this.alertService.errorHandler.bind(this.alertService)),
        finalize(() => this.spinnerService.stop())
      );
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
