import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-delete-todo',
  standalone: false,
  templateUrl: './delete-todo.component.html',
  styleUrls: ['./delete-todo.component.css']
})
export class DeleteTodoComponent {
  @Input() todoId!: number;
  @Output() deleted = new EventEmitter<void>();

  constructor(private todoService: TodoService) {}

  deleteTodo(): void {
    this.todoService.deleteTodo(this.todoId).subscribe({
      next: () => {
        console.log('Todo deleted successfully');
        this.deleted.emit();
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }
}