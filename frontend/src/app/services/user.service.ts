import { Injectable, inject } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { CreateUserRequestDto, CreateUserResponseDto, UserResponseDto } from '../interfaces/user.model';
import { CustomHttpClientService } from './custom-http-client.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _resource = '/users';
  private _userSubject = new ReplaySubject<UserResponseDto | null>(1);
  private _userId: string = '';

  // services
  private http = inject(CustomHttpClientService);
  private jwtService = inject(JwtService);

  constructor() {
    this.initializeUser();
  }

  private initializeUser() {
    if (this.jwtService.payload) {
      this._userId = this.jwtService.payload.id.toString();
      this.http
        .get<UserResponseDto>(this._resource + '/' + this._userId)
        .pipe(take(1))
        .subscribe({
          next: (user) => this._userSubject.next(user),
          error: () => this._userSubject.next(null),
        });
    } else {
      this._userSubject.next(null);
    }
  }

  get user$() {
    return this._userSubject.asObservable();
  }

  createUser(body: CreateUserRequestDto) {
    return this.http.post<CreateUserResponseDto>(this._resource, body);
  }
}
