# .NET Backend TODO API

This is a simple TODO list application built with Angular for the frontend and .NET for the backend. The backend provides a RESTful API to manage TODO items in memory.

## Project Structure

- **Controllers**: Contains the `TodoController` which handles HTTP requests for TODO items.
- **Models**: Contains the `TodoItem` class that defines the structure of a TODO item.
- **Services**: Contains the `TodoService` which manages the in-memory storage of TODO items.
- **Program.cs**: The entry point of the application using .NET 6+ minimal hosting model.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd todo-app/dotnet-backend
   ```

2. **Restore dependencies**:
   ```
   dotnet restore
   ```

3. **Run the application**:
   ```
   dotnet run
   ```

   The API will be available at `http://localhost:5000`.

## API Endpoints

- `GET /api/todos`: Retrieve all TODO items.
- `POST /api/todos`: Add a new TODO item.
- `DELETE /api/todos/{id}`: Delete a TODO item by ID.

## Testing

To run tests, use the following command:
```
dotnet test
```

## Best Practices

- Follow SOLID principles for code organization.
- Use dependency injection for services.
- Ensure proper error handling and validation in the API.

## License

This project is licensed under the MIT License.