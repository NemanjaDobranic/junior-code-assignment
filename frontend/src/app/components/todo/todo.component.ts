import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { take } from 'rxjs';
import { TodoRequestDto, TodoResponseDto } from '../../interfaces/todo.model';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  private _todoService = inject(TodoService);
  todoName: string = '';
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

  addItem() {
    if (!this.todoName.length) {
      alert('Cannot add blank item');
      return;
    }
    const todoPayload: TodoRequestDto = {
      name: this.todoName,
      completed: false,
    };
    this.todoName = '';
    this._todoService
      .create(todoPayload)
      .pipe(take(1))
      .subscribe((res) => {
        this.todoList = [res, ...this.todoList];
      });
  }
}
