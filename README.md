# TODO List Application

This project is a simple TODO list application that consists of an Angular frontend and a .NET Web API backend. Users can view, add, and delete TODO items, with all data managed in memory.

## Project Structure

```
todo-app
├── angular-frontend       # Angular frontend application
│   ├── src
│   │   ├── app
│   │   │   ├── components
│   │   │   │   ├── todo-list          # Component to display TODO items
│   │   │   │   ├── add-todo           # Component to add new TODO items
│   │   │   │   └── delete-todo        # Component to delete TODO items
│   │   │   ├── services               # Service to manage TODO items
│   │   │   ├── models                 # Model for TODO item structure
│   │   │   └── app.module.ts          # Main module of the Angular application
│   │   └── environments                # Environment-specific settings
│   ├── angular.json                   # Angular project configuration
│   ├── package.json                   # NPM dependencies and scripts
│   └── README.md                      # Documentation for the Angular frontend
├── dotnet-backend                     # .NET Web API backend application
│   ├── Controllers                    # Controllers for handling HTTP requests
│   ├── Models                         # Models representing data structures
│   ├── Services                       # Services for managing data
│   ├── Program.cs                     # Entry point of the .NET application
│   ├── Startup.cs                     # Configuration for services and middleware
│   ├── TodoApi.csproj                # Project file for the .NET application
│   └── README.md                      # Documentation for the .NET backend
└── README.md                          # Overall documentation for the project
```

## Getting Started

### Prerequisites

- Node.js and npm (for Angular frontend)
- .NET SDK (for .NET backend)

### Running the Angular Frontend

1. Navigate to the `angular-frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Angular application:
   ```
   ng serve
   ```
4. Open your browser and go to `http://localhost:4200`.

### Running the .NET Backend

1. Navigate to the `dotnet-backend` directory.
2. Restore dependencies:
   ```
   dotnet restore
   ```
3. Start the .NET application:
   ```
   dotnet run
   ```
4. The API will be available at `http://localhost:5000`.

## Features

- View a list of TODO items.
- Add new TODO items through a form.
- Delete TODO items from the list.

## Best Practices

- Follow Angular and .NET coding standards.
- Use services for data management.
- Implement component-based architecture in Angular.
- Ensure separation of concerns between frontend and backend.

## Testing

### Backend Testing (.NET with NUnit)
The backend includes comprehensive unit tests using NUnit framework:

```bash
cd dotnet-backend.Tests
dotnet test
```

**Test Coverage:**
- TodoService: 11 tests covering CRUD operations and edge cases
- TodoController: 12 tests covering API endpoints and HTTP responses
- Total: 23 passing tests

### Frontend Testing (Angular with Jasmine/Karma)
The frontend includes comprehensive unit tests using Jasmine and Karma:

```bash
cd angular-frontend
npm test
```

**Test Coverage:**
- TodoService: 12 tests covering HTTP operations and error handling
- Components: 32 tests covering all component functionality
- Total: 44 passing tests

### Running All Tests
To run both backend and frontend tests:

```bash
# Backend tests
cd dotnet-backend.Tests && dotnet test

# Frontend tests  
cd angular-frontend && npm test -- --watch=false --browsers=ChromeHeadless
```
