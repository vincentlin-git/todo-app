import { Component, EventEmitter, Output } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: false,
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent {
  newTodo: string = '';
  @Output() todoAdded = new EventEmitter<void>();

  constructor(private todoService: TodoService) {}

  addTodo() {
    if (this.newTodo.trim()) {
      this.todoService.addTodo(this.newTodo).subscribe({
        next: (todo) => {
          console.log('Todo added successfully:', todo);
          this.newTodo = '';
          this.todoAdded.emit();
        },
        error: (error) => {
          console.error('Error adding todo:', error);
        }
      });
    }
  }
}