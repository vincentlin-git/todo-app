using System.Collections.Generic;
using System.Linq;
using dotnet_backend.Models;

namespace dotnet_backend.Services
{
    public class TodoService
    {
        private readonly List<TodoItem> _todos = new List<TodoItem>();
        private int _nextId = 1;

        public IEnumerable<TodoItem> GetAll()
        {
            return _todos;
        }

        public TodoItem Add(TodoItem todo)
        {
            todo.Id = _nextId++;
            _todos.Add(todo);
            return todo;
        }

        public bool Delete(int id)
        {
            var todo = _todos.FirstOrDefault(t => t.Id == id);
            if (todo != null)
            {
                _todos.Remove(todo);
                return true;
            }
            return false;
        }
    }
}