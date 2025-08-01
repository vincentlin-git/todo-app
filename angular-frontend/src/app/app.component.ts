import { Component, ViewChild } from '@angular/core';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="container">
      <h1>TODO List Application</h1>
      <app-add-todo (todoAdded)="onTodoAdded()"></app-add-todo>
      <app-todo-list #todoList></app-todo-list>
    </div>
  `,
  styleUrls: []
})
export class AppComponent {
  title = 'todo-app';
  @ViewChild('todoList') todoListComponent!: TodoListComponent;

  onTodoAdded(): void {
    this.todoListComponent.fetchTodos();
  }
}
