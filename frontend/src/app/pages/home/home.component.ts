import { Component } from '@angular/core';
import { TodoComponent } from '../../components/todo/todo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
