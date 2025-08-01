import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  onTodoDeleted(): void {
    this.fetchTodos();
  }
}