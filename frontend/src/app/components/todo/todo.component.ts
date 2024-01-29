import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Subject, debounceTime, switchMap, take } from 'rxjs';
import { TodoRequestDto, TodoResponseDto } from '../../interfaces/todo.model';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, FormsModule, SearchBarComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnDestroy {
  private _searchSubject = new Subject<string>();
  private _todoService = inject(TodoService);
  private _userService = inject(UserService);
  user$ = this._userService.user$;
  todoName: string = '';
  todoList: TodoResponseDto[] = [];

  constructor() {
    this._todoService
      .getTodoList()
      .pipe(take(1))
      .subscribe({
        next: (res) => (this.todoList = res),
      });
    this.setupSearchListener();
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

  searchFor(text: string) {
    this._searchSubject.next(text);
  }

  private setupSearchListener() {
    this._searchSubject
      .pipe(
        debounceTime(300),
        switchMap((text) => this._todoService.getTodoList(text))
      )
      .subscribe((res) => (this.todoList = res));
  }

  ngOnDestroy(): void {
    this._searchSubject.unsubscribe();
  }
}
