import { Injectable, inject } from '@angular/core';
import { CustomHttpClientService } from './custom-http-client.service';
import { TodoResponseDto } from '../interfaces/todo.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _resource = '/todos';
  private http = inject(CustomHttpClientService);

  getTodoList() {
    return this.http.get<TodoResponseDto[]>(this._resource);
  }

  toggleComplete(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.patch<TodoResponseDto>(this._resource, params);
  }

  remove(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.delete<TodoResponseDto>(this._resource, params);
  }
}
