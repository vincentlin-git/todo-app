using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using dotnet_backend.Controllers;
using dotnet_backend.Services;
using dotnet_backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace dotnet_backend.Tests.Controllers
{
    [TestFixture]
    public class TodoControllerTests
    {
        private TodoService _todoService;
        private TodosController _controller;

        [SetUp]
        public void SetUp()
        {
            _todoService = new TodoService();
            _controller = new TodosController(_todoService);
        }

        [Test]
        public void GetTodos_WhenNoTodos_ReturnsEmptyList()
        {
            // Act
            var result = _controller.GetTodos();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            var todos = okResult.Value as IEnumerable<TodoItem>;
            Assert.That(todos, Is.Not.Null);
            Assert.That(todos, Is.Empty);
        }

        [Test]
        public void GetTodos_WithExistingTodos_ReturnsAllTodos()
        {
            // Arrange
            _todoService.Add(new TodoItem { Title = "Test Todo 1", IsCompleted = false });
            _todoService.Add(new TodoItem { Title = "Test Todo 2", IsCompleted = true });

            // Act
            var result = _controller.GetTodos();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            var todos = (okResult.Value as IEnumerable<TodoItem>)?.ToList();
            Assert.That(todos, Is.Not.Null);
            Assert.That(todos.Count, Is.EqualTo(2));
            Assert.That(todos.Any(t => t.Title == "Test Todo 1"), Is.True);
            Assert.That(todos.Any(t => t.Title == "Test Todo 2"), Is.True);
        }

        [Test]
        public void AddTodo_WithValidTodo_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var newTodo = new TodoItem { Title = "New Todo", IsCompleted = false };

            // Act
            var result = _controller.AddTodo(newTodo);

            // Assert
            var createdAtActionResult = result.Result as CreatedAtActionResult;
            Assert.That(createdAtActionResult, Is.Not.Null);
            var returnedTodo = createdAtActionResult.Value as TodoItem;
            Assert.That(returnedTodo, Is.Not.Null);
            
            Assert.That(createdAtActionResult.ActionName, Is.EqualTo("GetTodos"));
            Assert.That(returnedTodo.Title, Is.EqualTo("New Todo"));
            Assert.That(returnedTodo.IsCompleted, Is.False);
            Assert.That(returnedTodo.Id, Is.EqualTo(1));
        }

        [Test]
        public void AddTodo_AssignsIdToTodo()
        {
            // Arrange
            var newTodo = new TodoItem { Title = "New Todo", IsCompleted = false };

            // Act
            var result = _controller.AddTodo(newTodo);

            // Assert
            var createdAtActionResult = result.Result as CreatedAtActionResult;
            Assert.That(createdAtActionResult, Is.Not.Null);
            var returnedTodo = createdAtActionResult.Value as TodoItem;
            Assert.That(returnedTodo, Is.Not.Null);
            
            Assert.That(returnedTodo.Id, Is.GreaterThan(0));
        }

        [Test]
        public void DeleteTodo_WithExistingId_ReturnsNoContent()
        {
            // Arrange
            var addedTodo = _todoService.Add(new TodoItem { Title = "Test Todo", IsCompleted = false });

            // Act
            var result = _controller.DeleteTodo(addedTodo.Id);

            // Assert
            Assert.That(result, Is.TypeOf<NoContentResult>());
            Assert.That(_todoService.GetAll(), Is.Empty);
        }

        [Test]
        public void DeleteTodo_WithNonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteTodo(999);

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }

        [Test]
        public void DeleteTodo_RemovesOnlySpecifiedTodo()
        {
            // Arrange
            var todo1 = _todoService.Add(new TodoItem { Title = "Todo 1", IsCompleted = false });
            var todo2 = _todoService.Add(new TodoItem { Title = "Todo 2", IsCompleted = true });

            // Act
            var result = _controller.DeleteTodo(todo1.Id);

            // Assert
            Assert.That(result, Is.TypeOf<NoContentResult>());
            var remainingTodos = _todoService.GetAll().ToList();
            Assert.That(remainingTodos.Count, Is.EqualTo(1));
            Assert.That(remainingTodos.First().Id, Is.EqualTo(todo2.Id));
            Assert.That(remainingTodos.First().Title, Is.EqualTo("Todo 2"));
        }

        [TestCase("")]
        [TestCase("   ")]
        [TestCase(null)]
        public void AddTodo_WithInvalidTitle_StillCreatesSuccessfully(string title)
        {
            // Arrange
            var newTodo = new TodoItem { Title = title, IsCompleted = false };

            // Act
            var result = _controller.AddTodo(newTodo);

            // Assert
            var createdAtActionResult = result.Result as CreatedAtActionResult;
            Assert.That(createdAtActionResult, Is.Not.Null);
            var returnedTodo = createdAtActionResult.Value as TodoItem;
            Assert.That(returnedTodo, Is.Not.Null);
            Assert.That(returnedTodo.Title, Is.EqualTo(title));
        }

        [Test]
        public void AddTodo_SetsCorrectRouteValues()
        {
            // Arrange
            var newTodo = new TodoItem { Title = "Test Todo", IsCompleted = false };

            // Act
            var result = _controller.AddTodo(newTodo);

            // Assert
            var createdAtActionResult = result.Result as CreatedAtActionResult;
            Assert.That(createdAtActionResult, Is.Not.Null);
            var returnedTodo = createdAtActionResult.Value as TodoItem;
            Assert.That(returnedTodo, Is.Not.Null);
            
            Assert.That(createdAtActionResult.RouteValues, Is.Not.Null);
            Assert.That(createdAtActionResult.RouteValues.ContainsKey("id"), Is.True);
            Assert.That(createdAtActionResult.RouteValues["id"], Is.EqualTo(returnedTodo.Id));
        }
    }
}
