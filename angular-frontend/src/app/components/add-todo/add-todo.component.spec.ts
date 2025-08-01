import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['addTodo']);

    await TestBed.configureTestingModule({
      declarations: [AddTodoComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addTodo', () => {
    it('should add a new todo with valid title', () => {
      const newTitle = 'New Todo';
      const createdTodo: TodoItem = { id: 1, title: newTitle, isCompleted: false };
      todoService.addTodo.and.returnValue(of(createdTodo));
      spyOn(component.todoAdded, 'emit');
      spyOn(console, 'log');
      component.newTodo = newTitle;

      component.addTodo();

      expect(todoService.addTodo).toHaveBeenCalledWith(newTitle);
      expect(component.newTodo).toBe('');
      expect(component.todoAdded.emit).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Todo added successfully:', createdTodo);
    });

    it('should not add todo with empty title', () => {
      component.newTodo = '';

      component.addTodo();

      expect(todoService.addTodo).not.toHaveBeenCalled();
      expect(component.newTodo).toBe('');
    });

    it('should not add todo with whitespace-only title', () => {
      component.newTodo = '   ';

      component.addTodo();

      expect(todoService.addTodo).not.toHaveBeenCalled();
      expect(component.newTodo).toBe('   '); // Should remain unchanged
    });

    it('should trim whitespace before adding todo', () => {
      const titleWithSpaces = '  Valid Todo  ';
      const trimmedTitle = 'Valid Todo';
      const createdTodo: TodoItem = { id: 1, title: trimmedTitle, isCompleted: false };
      todoService.addTodo.and.returnValue(of(createdTodo));
      spyOn(component.todoAdded, 'emit');
      component.newTodo = titleWithSpaces;

      component.addTodo();

      expect(todoService.addTodo).toHaveBeenCalledWith(titleWithSpaces);
      expect(component.newTodo).toBe('');
      expect(component.todoAdded.emit).toHaveBeenCalled();
    });

    it('should handle error when adding todo', () => {
      const newTitle = 'New Todo';
      const errorResponse = { status: 400, message: 'Bad request' };
      todoService.addTodo.and.returnValue(throwError(() => errorResponse));
      spyOn(component.todoAdded, 'emit');
      spyOn(console, 'error');
      component.newTodo = newTitle;

      component.addTodo();

      expect(todoService.addTodo).toHaveBeenCalledWith(newTitle);
      expect(console.error).toHaveBeenCalledWith('Error adding todo:', errorResponse);
      expect(component.todoAdded.emit).not.toHaveBeenCalled();
      expect(component.newTodo).toBe(newTitle); // Should not clear on error
    });
  });

  describe('component initialization', () => {
    it('should initialize with empty newTodo', () => {
      expect(component.newTodo).toBe('');
    });

    it('should have todoAdded event emitter', () => {
      expect(component.todoAdded).toBeDefined();
      expect(component.todoAdded instanceof EventEmitter).toBe(true);
    });
  });

  describe('event emission', () => {
    it('should emit todoAdded event only on successful addition', () => {
      const newTitle = 'New Todo';
      const createdTodo: TodoItem = { id: 1, title: newTitle, isCompleted: false };
      todoService.addTodo.and.returnValue(of(createdTodo));
      spyOn(component.todoAdded, 'emit');
      component.newTodo = newTitle;

      component.addTodo();

      expect(component.todoAdded.emit).toHaveBeenCalledTimes(1);
      expect(component.todoAdded.emit).toHaveBeenCalledWith();
    });

    it('should not emit todoAdded event on error', () => {
      const newTitle = 'New Todo';
      const errorResponse = { status: 500, message: 'Server error' };
      todoService.addTodo.and.returnValue(throwError(() => errorResponse));
      spyOn(component.todoAdded, 'emit');
      spyOn(console, 'error');
      component.newTodo = newTitle;

      component.addTodo();

      expect(component.todoAdded.emit).not.toHaveBeenCalled();
    });
  });
});
