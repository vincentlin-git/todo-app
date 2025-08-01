import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  const mockTodos: TodoItem[] = [
    { id: 1, title: 'Test Todo 1', isCompleted: false },
    { id: 2, title: 'Test Todo 2', isCompleted: true },
    { id: 3, title: 'Test Todo 3', isCompleted: false }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['getTodos', 'addTodo', 'deleteTodo']);

    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchTodos on initialization', () => {
      spyOn(component, 'fetchTodos');

      component.ngOnInit();

      expect(component.fetchTodos).toHaveBeenCalled();
    });
  });

  describe('fetchTodos', () => {
    it('should load todos successfully', () => {
      todoService.getTodos.and.returnValue(of(mockTodos));

      component.fetchTodos();

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(component.todos).toEqual(mockTodos);
    });

    it('should handle empty todos list', () => {
      todoService.getTodos.and.returnValue(of([]));

      component.fetchTodos();

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(component.todos).toEqual([]);
    });

    it('should handle error when loading todos', () => {
      const errorResponse = { status: 500, message: 'Server error' };
      todoService.getTodos.and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');

      component.fetchTodos();

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error fetching todos:', errorResponse);
    });
  });

  describe('onTodoDeleted', () => {
    it('should refresh todos when called', () => {
      spyOn(component, 'fetchTodos');

      component.onTodoDeleted();

      expect(component.fetchTodos).toHaveBeenCalled();
    });
  });

  describe('component initialization', () => {
    it('should initialize with empty todos array', () => {
      expect(component.todos).toEqual([]);
    });

    it('should have TodoService injected', () => {
      expect(component['todoService']).toBeTruthy();
    });
  });

  describe('todos array operations', () => {
    beforeEach(() => {
      component.todos = [...mockTodos];
    });

    it('should correctly filter completed todos', () => {
      const completedTodos = component.todos.filter(todo => todo.isCompleted);
      expect(completedTodos.length).toBe(1);
      expect(completedTodos[0].title).toBe('Test Todo 2');
    });

    it('should correctly filter incomplete todos', () => {
      const incompleteTodos = component.todos.filter(todo => !todo.isCompleted);
      expect(incompleteTodos.length).toBe(2);
      expect(incompleteTodos.map(t => t.title)).toEqual(['Test Todo 1', 'Test Todo 3']);
    });

    it('should handle todos array manipulation', () => {
      const initialLength = component.todos.length;
      
      // Add a todo
      const newTodo: TodoItem = { id: 4, title: 'New Todo', isCompleted: false };
      component.todos.push(newTodo);
      expect(component.todos.length).toBe(initialLength + 1);
      expect(component.todos).toContain(newTodo);

      // Remove a todo
      component.todos = component.todos.filter(todo => todo.id !== newTodo.id);
      expect(component.todos.length).toBe(initialLength);
      expect(component.todos).not.toContain(newTodo);
    });
  });
});
