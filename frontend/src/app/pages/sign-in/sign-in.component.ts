import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, SpinnerComponent, AsyncPipe],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private _authService = inject(AuthService);
  private _jwtService = inject(JwtService);
  private _router = inject(Router);
  private _spinnerService = inject(SpinnerService);
  isLoading$ = this._spinnerService.isVisible$;

  logIn(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    const payload = {
      email: email.value,
      password: password.value,
    };

    this._authService.signIn(payload).subscribe(({ accessToken }) => {
      this._jwtService.token = accessToken;
      this._router.navigate(['home']);
    });
  }
}
