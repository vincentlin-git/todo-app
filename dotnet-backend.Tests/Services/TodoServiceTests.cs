using NUnit.Framework;
using dotnet_backend.Services;
using dotnet_backend.Models;
using System.Linq;

namespace dotnet_backend.Tests.Services
{
    [TestFixture]
    public class TodoServiceTests
    {
        private TodoService _service;

        [SetUp]
        public void SetUp()
        {
            _service = new TodoService();
        }

        [Test]
        public void GetAll_WhenNoTodos_ReturnsEmptyList()
        {
            // Act
            var result = _service.GetAll();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Is.Empty);
        }

        [Test]
        public void Add_WithValidTodo_ReturnsAddedTodoWithId()
        {
            // Arrange
            var todo = new TodoItem { Title = "Test Todo", IsCompleted = false };

            // Act
            var result = _service.Add(todo);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(1));
            Assert.That(result.Title, Is.EqualTo("Test Todo"));
            Assert.That(result.IsCompleted, Is.False);
        }

        [Test]
        public void Add_MultipleTodos_AssignsIncrementingIds()
        {
            // Arrange
            var todo1 = new TodoItem { Title = "First Todo", IsCompleted = false };
            var todo2 = new TodoItem { Title = "Second Todo", IsCompleted = true };

            // Act
            var result1 = _service.Add(todo1);
            var result2 = _service.Add(todo2);

            // Assert
            Assert.That(result1.Id, Is.EqualTo(1));
            Assert.That(result2.Id, Is.EqualTo(2));
            Assert.That(result1.Title, Is.EqualTo("First Todo"));
            Assert.That(result2.Title, Is.EqualTo("Second Todo"));
            Assert.That(result1.IsCompleted, Is.False);
            Assert.That(result2.IsCompleted, Is.True);
        }

        [Test]
        public void GetAll_AfterAddingTodos_ReturnsAllTodos()
        {
            // Arrange
            var todo1 = new TodoItem { Title = "First Todo", IsCompleted = false };
            var todo2 = new TodoItem { Title = "Second Todo", IsCompleted = true };
            _service.Add(todo1);
            _service.Add(todo2);

            // Act
            var result = _service.GetAll().ToList();

            // Assert
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result.Any(t => t.Title == "First Todo" && !t.IsCompleted), Is.True);
            Assert.That(result.Any(t => t.Title == "Second Todo" && t.IsCompleted), Is.True);
        }

        [Test]
        public void Delete_WithExistingId_ReturnsTrueAndRemovesTodo()
        {
            // Arrange
            var todo = new TodoItem { Title = "Test Todo", IsCompleted = false };
            var addedTodo = _service.Add(todo);

            // Act
            var result = _service.Delete(addedTodo.Id);

            // Assert
            Assert.That(result, Is.True);
            Assert.That(_service.GetAll(), Is.Empty);
        }

        [Test]
        public void Delete_WithNonExistingId_ReturnsFalse()
        {
            // Act
            var result = _service.Delete(999);

            // Assert
            Assert.That(result, Is.False);
        }

        [Test]
        public void Delete_OneOfMultipleTodos_RemovesOnlyTargetTodo()
        {
            // Arrange
            var todo1 = new TodoItem { Title = "First Todo", IsCompleted = false };
            var todo2 = new TodoItem { Title = "Second Todo", IsCompleted = true };
            var addedTodo1 = _service.Add(todo1);
            var addedTodo2 = _service.Add(todo2);

            // Act
            var result = _service.Delete(addedTodo1.Id);

            // Assert
            Assert.That(result, Is.True);
            var remainingTodos = _service.GetAll().ToList();
            Assert.That(remainingTodos.Count, Is.EqualTo(1));
            Assert.That(remainingTodos.First().Title, Is.EqualTo("Second Todo"));
            Assert.That(remainingTodos.First().Id, Is.EqualTo(addedTodo2.Id));
        }

        [TestCase("")]
        [TestCase("   ")]
        [TestCase(null)]
        public void Add_WithInvalidTitle_StillAddsButMaintainsValue(string title)
        {
            // Arrange
            var todo = new TodoItem { Title = title, IsCompleted = false };

            // Act
            var result = _service.Add(todo);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(1));
            Assert.That(result.Title, Is.EqualTo(title));
        }

        [Test]
        public void Add_PreservesOriginalIdIfSet()
        {
            // Arrange
            var todo = new TodoItem { Id = 100, Title = "Test Todo", IsCompleted = false };

            // Act
            var result = _service.Add(todo);

            // Assert
            // The service should assign its own ID, not preserve the original
            Assert.That(result.Id, Is.EqualTo(1));
            Assert.That(result.Id, Is.Not.EqualTo(100));
        }
    }
}
