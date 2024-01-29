import { Injectable, inject } from '@angular/core';
import { SingInRequestDto, SingInResponseDto } from '../interfaces/auth.model';
import { CustomHttpClientService } from './custom-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _resource = '/auth';
  private _http = inject(CustomHttpClientService);

  signIn(signInDto: SingInRequestDto) {
    return this._http.post<SingInResponseDto>(
      this._resource,
      signInDto
    );
  }
}
