# Todo Backend

TypeScript + Express + MongoDB backend for the Ziptrrip Todo assignment.

## Organization

- config/ — database and runtime configuration
- controllers/ — HTTP request/response handlers
- middleware/ — authentication and request middleware
- models/ — Mongoose schemas
- routes/ — API route definitions
- services/ — business logic for auth, todos, password reset and Google authentication
- types/ — shared TypeScript domain types
- utils/ — JWT, mail and Firebase Admin helpers
- validators/ — reusable validation helpers
- tests/ — Vitest unit tests
- postman/ — Postman API collection
- requests/ — VS Code REST Client requests

Application source is TypeScript. Compiled output is written only to dist/.

## API

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/verify-reset-code
- POST /api/auth/reset-password

### Todos

- POST /api/todos
- GET /api/todos
- GET /api/todos/:id
- PATCH /api/todos/:id
- DELETE /api/todos/:id

### AI

- POST /api/ai/todo

All Todo APIs require the JWT HttpOnly cookie created by authentication.

## Testing

```bash
npm ci
npm run build
npm test
```

The unit tests cover authentication validation, JWT generation, password-reset behavior and Google authentication behavior.

## API clients

Postman: postman/todo-api.postman_collection.json

REST Client: requests/todos.http

## Environment

Copy .env.example to .env and provide MongoDB, JWT, email, Gemini and Firebase Admin credentials as needed. Never commit .env or Firebase service-account private keys.
