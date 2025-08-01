using Microsoft.AspNetCore.Mvc;
using dotnet_backend.Models;
using dotnet_backend.Services;
using System.Collections.Generic;

namespace dotnet_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly TodoService _todoService;

        public TodosController(TodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TodoItem>> GetTodos()
        {
            return Ok(_todoService.GetAll());
        }

        [HttpPost]
        public ActionResult<TodoItem> AddTodo([FromBody] TodoItem todoItem)
        {
            var createdTodo = _todoService.Add(todoItem);
            return CreatedAtAction(nameof(GetTodos), new { id = createdTodo.Id }, createdTodo);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTodo(int id)
        {
            var result = _todoService.Delete(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}