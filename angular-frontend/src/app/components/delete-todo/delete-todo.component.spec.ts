import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { DeleteTodoComponent } from './delete-todo.component';
import { TodoService } from '../../services/todo.service';

describe('DeleteTodoComponent', () => {
  let component: DeleteTodoComponent;
  let fixture: ComponentFixture<DeleteTodoComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['deleteTodo']);

    await TestBed.configureTestingModule({
      declarations: [DeleteTodoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteTodo', () => {
    beforeEach(() => {
      component.todoId = 1;
    });

    it('should delete todo successfully', () => {
      todoService.deleteTodo.and.returnValue(of({}));
      spyOn(component.deleted, 'emit');
      spyOn(console, 'log');

      component.deleteTodo();

      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
      expect(component.deleted.emit).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Todo deleted successfully');
    });

    it('should handle error when deleting todo', () => {
      const errorResponse = { status: 404, message: 'Not found' };
      todoService.deleteTodo.and.returnValue(throwError(() => errorResponse));
      spyOn(component.deleted, 'emit');
      spyOn(console, 'error');

      component.deleteTodo();

      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('Error deleting todo:', errorResponse);
      expect(component.deleted.emit).not.toHaveBeenCalled();
    });

    it('should delete todo with different id', () => {
      component.todoId = 42;
      todoService.deleteTodo.and.returnValue(of({}));
      spyOn(component.deleted, 'emit');

      component.deleteTodo();

      expect(todoService.deleteTodo).toHaveBeenCalledWith(42);
      expect(component.deleted.emit).toHaveBeenCalled();
    });
  });

  describe('component properties', () => {
    it('should have todoId input property', () => {
      component.todoId = 123;
      expect(component.todoId).toBe(123);
    });

    it('should have deleted event emitter', () => {
      expect(component.deleted).toBeDefined();
      expect(component.deleted instanceof EventEmitter).toBe(true);
    });
  });

  describe('event emission', () => {
    beforeEach(() => {
      component.todoId = 1;
    });

    it('should emit deleted event only on successful deletion', () => {
      todoService.deleteTodo.and.returnValue(of({}));
      spyOn(component.deleted, 'emit');

      component.deleteTodo();

      expect(component.deleted.emit).toHaveBeenCalledTimes(1);
      expect(component.deleted.emit).toHaveBeenCalledWith();
    });

    it('should not emit deleted event on error', () => {
      const errorResponse = { status: 500, message: 'Server error' };
      todoService.deleteTodo.and.returnValue(throwError(() => errorResponse));
      spyOn(component.deleted, 'emit');
      spyOn(console, 'error');

      component.deleteTodo();

      expect(component.deleted.emit).not.toHaveBeenCalled();
    });
  });

  describe('error scenarios', () => {
    beforeEach(() => {
      component.todoId = 999;
    });

    it('should handle network errors', () => {
      const networkError = { status: 0, message: 'Network error' };
      todoService.deleteTodo.and.returnValue(throwError(() => networkError));
      spyOn(console, 'error');

      component.deleteTodo();

      expect(todoService.deleteTodo).toHaveBeenCalledWith(999);
      expect(console.error).toHaveBeenCalledWith('Error deleting todo:', networkError);
    });

    it('should handle server errors', () => {
      const serverError = { status: 500, message: 'Internal server error' };
      todoService.deleteTodo.and.returnValue(throwError(() => serverError));
      spyOn(console, 'error');

      component.deleteTodo();

      expect(todoService.deleteTodo).toHaveBeenCalledWith(999);
      expect(console.error).toHaveBeenCalledWith('Error deleting todo:', serverError);
    });
  });
});
