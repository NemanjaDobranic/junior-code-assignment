import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Alert, alertColorMap } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _show$ = new BehaviorSubject<boolean>(false);
  private data$ = new BehaviorSubject<Alert>({
    name: 'Success',
    message: '',
    color: alertColorMap['Success'],
  });

  get show$() {
    return this._show$.asObservable();
  }

  toggleAlert() {
    this._show$.next(!this._show$.getValue());
  }

  errorHandler(error: HttpErrorResponse) {
    this.setData(error.status + '', error.error.error);
    return throwError(() => error);
  }

  setData(code: string, message: string | string[]) {
    const thirdDecimal = +code.charAt(0);

    if (Array.isArray(message)) {
      message = message
        .map((el) => el.charAt(0).toUpperCase() + el.substring(1))
        .join('.<br>');
      message += '.';
    }

    switch (thirdDecimal) {
      case 1:
        this.data$.next({
          name: 'Informational',
          message,
          color: alertColorMap.Informational,
        });
        this._show$.next(true);
        break;
      case 2:
        this.data$.next({
          name: 'Success',
          message,
          color: alertColorMap.Success,
        });
        this._show$.next(true);
        break;
      case 3:
        this.data$.next({
          name: 'Redirection',
          message,
          color: alertColorMap.Redirection,
        });
        this._show$.next(true);
        break;
      case 4:
        this.data$.next({
          name: 'Client Error',
          message,
          color: alertColorMap['Client Error'],
        });
        this._show$.next(true);
        break;
      case 5:
        this.data$.next({
          name: 'Server Error',
          message,
          color: alertColorMap['Server Error'],
        });
        this._show$.next(true);
        break;
    }
  }

  getData() {
    return this.data$;
  }
}
