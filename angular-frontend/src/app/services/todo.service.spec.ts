import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoItem } from '../models/todo.model';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodos', () => {
    it('should return an Observable<TodoItem[]>', () => {
      const dummyTodos: TodoItem[] = [
        { id: 1, title: 'Test Todo 1', isCompleted: false },
        { id: 2, title: 'Test Todo 2', isCompleted: true }
      ];

      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(dummyTodos);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyTodos);
    });

    it('should handle empty response', () => {
      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(0);
        expect(todos).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('addTodo', () => {
    it('should add a todo and return it', () => {
      const todoTitle = 'New Todo';
      const expectedRequestBody = { 
        id: 0, 
        title: todoTitle, 
        isCompleted: false
      };
      const createdTodo: TodoItem = { id: 1, title: todoTitle, isCompleted: false };

      service.addTodo(todoTitle).subscribe(todo => {
        expect(todo).toEqual(createdTodo);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedRequestBody);
      req.flush(createdTodo);
    });

    it('should handle todo with empty title', () => {
      const todoTitle = '';
      const expectedRequestBody = { 
        id: 0, 
        title: todoTitle, 
        isCompleted: false
      };
      const createdTodo: TodoItem = { id: 1, title: todoTitle, isCompleted: false };

      service.addTodo(todoTitle).subscribe(todo => {
        expect(todo).toEqual(createdTodo);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedRequestBody);
      req.flush(createdTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo by id', () => {
      const todoId = 1;

      service.deleteTodo(todoId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${todoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle non-existent todo', () => {
      const todoId = 999;

      service.deleteTodo(todoId).subscribe({
        next: () => fail('Expected an error, not a success response'),
        error: (error) => expect(error.status).toBe(404)
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${todoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Todo not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('HTTP error handling', () => {
    it('should handle HTTP errors for getTodos', () => {
      service.getTodos().subscribe({
        next: () => fail('Expected an error, not todos'),
        error: (error) => expect(error.status).toBe(500)
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle HTTP errors for addTodo', () => {
      const todoTitle = 'New Todo';

      service.addTodo(todoTitle).subscribe({
        next: () => fail('Expected an error, not a todo'),
        error: (error) => expect(error.status).toBe(400)
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });
});
