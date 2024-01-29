import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CustomHttpClientService {
  // services

  private http = inject(HttpClient);
  private jwtService = inject(JwtService);

  private token = this.jwtService.token;

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(environment.apiUrl + path, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
      params: params ? params : {},
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(environment.apiUrl + path, body, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    });
  }

  patch<T>(path: string, params?: HttpParams, body?: any): Observable<T> {
    return this.http.patch<T>(environment.apiUrl + path, body, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
      params: params ? params : {},
    });
  }

  delete<T>(path: string, params?: any, body?: any): Observable<T> {
    return this.http.delete<T>(environment.apiUrl + path, {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
      body: body,
      params: params ? params : {},
    });
  }
}
