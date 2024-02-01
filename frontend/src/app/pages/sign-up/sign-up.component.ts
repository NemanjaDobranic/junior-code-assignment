import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CreateUserRequestDto } from '../../interfaces/user.model';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _spinnerService = inject(SpinnerService);
  isLoading$ = this._spinnerService.isVisible$;

  signUp(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem('username') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    const body: CreateUserRequestDto = {
      name: username.value,
      email: email.value,
      password: password.value,
    };

    this._userService
      .createUser(body)
      .subscribe((res) =>
        this._router
          .navigate(['sign-in'])
          .then(() =>
            alert(
              `Congratulations, ${res.name}. You have signed up successfully. Wish you have a nice experience.`
            )
          )
      );
  }
}
