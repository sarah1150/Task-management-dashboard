# Task Management Dashboard

## 1. Project Overview and Architecture Decisions

The Task Management Dashboard is a modern task management application built with **Angular 22.3.0**, following scalable and maintainable architectural practices.

### Architecture Decisions

- **Standalone Components:** The application uses Angular Standalone Components to simplify component composition and reduce dependency on NgModules.
- **Feature-Based Architecture:** Application functionality is organized into feature-based directories, making the codebase easier to maintain, extend, and scale.
- **Smart and Presentational Components:** Components are separated based on responsibility:
  - **Smart (Container) Components:** Handle application logic, state management, and communication with the store.
  - **Presentational Components:** Focus on displaying data and handling user interactions through inputs, keeping UI components reusable and independent of business logic.

### Project Structure

```text
src/app/
├── core/                  # Core application services and singleton functionality
├── shared/
│   └── form-modal/                 # Reusable Modal components and utilities
│   └── confirm-modal/
├── features/
│   └── dashboard/         # Dashboard and task management components and container
├── layout/
│   ├── side-bar/          # Application sidebar
│   └── navbar/            # Application navigation bar
├── store/                 # Centralized application state management
└── app.routes.ts          # Application routing configuration
```

The structure separates application-wide functionality, reusable resources, feature-specific functionality, layout components, and centralized state management.

## 2. Setup and Installation Instructions

### Prerequisites

Make sure the following tools and versions are installed:

- Node.js: `24.18.0`
- npm: `11.16.0`
- Angular CLI: `22.3.0`
- Angular: `22.3.0`
- TypeScript: `6.0.3`
- RxJS: `7.8.2`

The project was developed and tested on Windows 64-bit.

Verify your installed versions:

```bash
node -v
npm -v
ng version
```

### Clone the Repository

```bash
git  clone https://github.com/sarah1150/Task-management-dashboard
cd   Task-management-dashboard
```

### Install Dependencies

```bash
npm install
```

### Mock Backend Setup

The project uses **JSON Server** as a mock backend.

The `db.json` file is included in the repository with generated data, so there is no need to generate the initial data manually.

To start the mock backend:

```bash
npm run api
```

The backend runs on port `3600`.

The project also includes a customized data generation script at:

```text
data-fetching/generate-data.js
```

This script can be used to regenerate the mock data when needed.

### Run the Application

Start the frontend and backend in separate terminals.

**Terminal 1 – Angular Application**

```bash
npm start
```

**Terminal 2 – JSON Server**

```bash
npm run api
```

## 3. Environment Configuration

### API Configuration

The application uses Angular's development proxy configuration to communicate with the JSON Server mock backend.

Instead of hardcoding the backend URL throughout the application, API requests use the `/api` prefix.

### Proxy Configuration

The proxy is configured in `proxy.config.json`:

```json
{
  "/api": {
    "target": "http://localhost:3600",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

The proxy configuration is registered in `angular.json`:

```json
{
  "options": {
    "proxyConfig": "proxy.config.json"
  }
}
```

This configuration redirects frontend requests to the JSON Server backend running on port `3600`, while removing the `/api` prefix before forwarding the request.

### API Services

The application separates API responsibilities into two services:

- **TaskResourceService:** Uses Angular's `httpResource` API for fetching tasks, users, and statistics. It converts resource states into Observables and handles successful responses and errors.
- **TaskApiService:** Uses Angular `HttpClient` to handle task mutations, including creating, updating, moving, and deleting tasks.

Both services normalize task data to maintain consistent task properties and metadata across the application.

### State Management and Data Caching

The application uses **NgRx Effects and Store** to manage API requests and maintain a client-side cache.

The effects check the corresponding loaded flags in the store before making read requests:

- If the data has already been loaded, the effect skips the HTTP request.
- If the data has not been loaded, the effect fetches it through `TaskResourceService` and dispatches a success action.
- A `force` option allows reloading data even when it is already cached.

Successful create, update, move, and delete operations are handled through NgRx Effects and success actions, allowing the reducers to update the store without unnecessarily reloading the entire collection.

**Note:** The cache is maintained in NgRx Store memory and is not persisted across browser refreshes.

**Note:** The current proxy configuration is intended for local development. The backend target can be adjusted when running the application against a different backend environment.

## 4. Available Scripts and Commands

The following scripts are available in `package.json`:

| Command                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `npm install`           | Installs project dependencies.                                       |
| `npm start`             | Starts the Angular development server using the proxy configuration. |
| `npm run api`           | Starts JSON Server on port `3600`.                                   |
| `npm run build`         | Builds the Angular application.                                      |
| `npm test`              | Runs the unit test suite.                                            |
| `npm run test:coverage` | Runs tests and generates a code coverage report.                     |
| `npm run lint`          | Runs ESLint to check code quality.                                   |
| `npm run format`        | Formats project files using Prettier.                                |
| `npm run data:generate` | Regenerates mock backend data.                                       |
| `npm run prepare`       | Runs the Husky setup script.                                         |

### Running the Application

1. Open the first terminal and run:

   ```bash
   npm start
   ```

2. Open a second terminal and run:

   ```bash
   npm run api
   ```

### Testing and Code Quality

Run the following commands when needed:

```bash
npm test
npm run test:coverage
npm run lint
npm run format
```

## 5. Design Patterns and State Management Explanation

### NgRx State Management

The application uses **NgRx Store** for centralized state management, providing a predictable and structured approach to managing application data and handling state changes.

The NgRx architecture consists of the following building blocks:

- **Actions:** Describe events and operations that trigger state changes, such as loading, creating, updating, moving, and deleting tasks.
- **Reducers:** Handle dispatched actions and produce updated state immutably using `createReducer`.
- **Selectors:** Provide reusable and efficient access to specific parts of the application state.
- **Effects:** Handle side effects, including API requests, error handling, and communication with application services.
- **Store:** Maintains the centralized application state and makes it available to components through selectors.

This separation of responsibilities keeps business logic organized, improves maintainability, and makes application behavior easier to test.

### Angular Signals

Angular Signals are used alongside NgRx to manage reactive UI state and simplify component communication.

The application uses:

- **`signal()`:** Manages local UI state, such as the navigation sidebar's open/closed state through the `navOpen` signal.
- **`selectSignal()`:** Reads NgRx selectors as Signals, allowing components to reactively access store data.
- **`computed()`:** Combines multiple selector results into a single derived reactive value inside `DashboardContainerComponent`.
- **Signal-based `input()`:** Passes the combined dashboard data from `DashboardContainerComponent` to `DashboardPageComponent`.

This approach combines NgRx's centralized state management with Angular's fine-grained reactivity.

### Smart and Presentational Component Communication

- **DashboardContainerComponent (Smart Component):** Retrieves application data from NgRx Store using `selectSignal()`, combines the results using `computed()`, and passes the resulting data to the child component.
- **DashboardPageComponent (Presentational Component):** Receives the required data through Angular's signal-based `input()` and focuses on displaying the UI.

This approach reduces direct dependencies between presentation components and the centralized store, improving reusability and maintainability.

### Reactive Forms and Validation

The application uses Angular Reactive Forms to manage task creation and editing.

- **Reusable Form Component:** The same modal form component is shared between create and edit operations. The data passed to the form depends on the operation being performed.
- **Custom Validators:** Custom validation logic is centralized in `shared/validator/FormValidatorService`, keeping validation rules separate from the component.
- **Validation Feedback:** Validation errors are displayed in the UI to help users identify and correct invalid input.

This approach reduces code duplication and keeps form validation organized and reusable.

## 6. Testing Strategy

The application uses unit testing to verify individual parts of the application and ensure they behave as expected.

### Testing Tools

The project uses:

- **Jasmine:** Testing framework used to write and organize unit tests.
- **Karma:** Test runner used to execute the tests in the browser.

### Unit Testing Coverage

Tests are implemented for the following areas:

- **Components:** Tests cover component creation and UI behavior.
- **Services:** Tests verify service methods and their expected behavior.
- **Custom Validators:** Tests validate the custom validation rules implemented in `FormValidatorService`.
- **NgRx Selectors:** Tests verify that selectors return the expected data from the application state.
- **NgRx Reducers:** Tests verify state transitions and ensure that actions produce the expected state updates.

### Test Results and Code Coverage

The project successfully executed **179 unit tests**, with all tests passing.

The generated code coverage report shows:

| Metric     | Coverage | Covered / Total |
| ---------- | -------: | --------------: |
| Statements |   98.57% |       276 / 280 |
| Branches   |   89.13% |         82 / 92 |
| Functions  |   97.14% |       102 / 105 |
| Lines      |   98.76% |       239 / 242 |

### Running Tests

```bash
npm test
npm run test:coverage
```

- `npm test` – Runs the unit test suite.
- `npm run test:coverage` – Runs tests and generates a code coverage report.

## 7. Performance Optimization Techniques

The application applies several Angular performance optimization techniques to improve rendering efficiency and avoid unnecessary component updates.

### Change Detection Optimization

- **OnPush Change Detection:** Uses `ChangeDetectionStrategy.OnPush` to reduce unnecessary change detection cycles and improve component rendering performance.

### Signals and Reactive State

- **Angular Signals:** Uses `signal()` and `computed()` to manage reactive state and derive values efficiently, helping avoid unnecessary recalculations and UI updates.

### List Rendering Optimization

- **Track in `@for` Loops:** Uses the `track` expression in Angular's `@for` loops to help Angular identify list items and efficiently update the DOM when collections change.

## 8. Future Improvements

- **Backend Integration:** Replace the JSON Server mock backend with a production-ready backend API to support real-world data persistence and business logic.
- **Expanded Testing:** Introduce integration and end-to-end testing to complement the existing unit testing strategy.
