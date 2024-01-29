import { Injectable, inject } from '@angular/core';
import { CustomHttpClientService } from './custom-http-client.service';
import { TodoRequestDto, TodoResponseDto } from '../interfaces/todo.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _resource = '/todos';
  private http = inject(CustomHttpClientService);

  getTodoList(name?: string) {
    let params = new HttpParams();
    if (name) params = new HttpParams().set('name', name);
    return this.http.get<TodoResponseDto[]>(this._resource, params);
  }

  toggleComplete(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.patch<TodoResponseDto>(this._resource, params);
  }

  remove(id: number) {
    const params = new HttpParams().set('id', id);
    return this.http.delete<TodoResponseDto>(this._resource, params);
  }

  create(body: TodoRequestDto) {
    return this.http.post<TodoResponseDto>(this._resource, body);
  }
}
