import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { take } from 'rxjs';
import { TodoResponseDto } from '../../interfaces/todo.model';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  private _todoService = inject(TodoService);
  todoList: TodoResponseDto[] = [];

  constructor() {
    this._todoService
      .getTodoList()
      .pipe(take(1))
      .subscribe({
        next: (res) => (this.todoList = res),
      });
  }

  toggleComplete(id: number) {
    const index = this.todoList.findIndex((todo) => todo.id === id);
    if (index == -1) {
      return;
    }

    const itemToUpdate = this.todoList.at(index);
    if (itemToUpdate) {
      itemToUpdate.completed != itemToUpdate.completed;
      this.todoList.splice(index, 1, itemToUpdate);
      this._todoService.toggleComplete(id).pipe(take(1)).subscribe();
    }
  }

  removeItem(id: number) {
    this.todoList = this.todoList.filter((item) => item.id != id);
    this._todoService.remove(id).subscribe();
  }
}
