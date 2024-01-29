import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { TodoResponseDto } from '../../interfaces/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() data!: TodoResponseDto;
  @Output() completed = new EventEmitter<number>();

  toggleComplete() {
    this.completed.emit(this.data.id);
  }
}
