import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _show$ = new BehaviorSubject(false);
  isVisible$ = this._show$.asObservable();

  start() {
    this._show$.next(true);
  }

  stop() {
    this._show$.next(false);
  }
}
