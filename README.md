# Todo — Ziptrrip Technical Assignment

A TypeScript Todo application with an Express/MongoDB backend and a React/Vite multi-page frontend.

## Assignment alignment

The assignment asks for a React Multiple Page Application, a todo list page, a todo detail page using a todo-id query parameter, a JavaScript/TypeScript backend with CRUD APIs, repository documentation, and—when applying as a backend developer—unit tests plus Postman/REST Client files. The repository implements all of those requirements.

## Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS, Framer Motion, Firebase Authentication
- Backend: Node.js 22, Express 5, TypeScript, MongoDB/Mongoose, JWT HttpOnly cookies, Firebase Admin, Nodemailer, Redis-ready configuration
- AI: Gemini-based todo generation
- Testing: Vitest
- API clients: Postman collection + VS Code REST Client
- CI: GitHub Actions builds frontend/backend and runs backend unit tests

## Frontend MPA

The frontend intentionally uses separate HTML entry points instead of a client-side SPA router.

| Page | Entry | Purpose |
| --- | --- | --- |
| Todo list | /index.html | Authenticated todo list, filtering, sorting and CRUD actions |
| Login | /login.html | Email/password and Google sign-in |
| Register | /register.html | Email/password and Google registration |
| Create todo | /create.html | Create a todo manually or with AI |
| Todo details | /todo.html?id=<todoId> | View/update/delete one todo using the required query parameter |
| Forgot password | /forgot-password.html | Email OTP verification and password reset |

## Backend organization

Business logic is separated from transport concerns:

- controllers/ — HTTP handlers
- routes/ — endpoint definitions
- services/ — authentication, todo, password reset and Google auth business logic
- models/ — MongoDB schemas
- middleware/ — JWT protection
- utils/ — JWT, email and Firebase Admin integration
- validators/ — reusable validation
- tests/ — unit tests
- postman/ and requests/ — API testing resources

Compiled TypeScript output is written only to backend/dist/.

## Authentication

### Email/password

Registration and login create a JWT stored in an HttpOnly cookie. Protected todo APIs use that cookie.

### Google

The frontend authenticates with Firebase Google Sign-In and sends the Firebase ID token to POST /api/auth/google. The backend verifies the token with Firebase Admin, finds or creates the MongoDB user, then issues the application's JWT cookie.

### Password reset

The forgot-password flow generates a six-digit OTP, stores only a hash and expiry in MongoDB, sends the code through Gmail SMTP, verifies the code, then allows a password change.

## Todo features

- Create, read, update and delete todos
- Completion state
- Priority
- Due dates
- Search
- Status filtering
- Priority filtering
- Sorting
- Todo details page
- Pagination
- AI-assisted todo creation

## API testing

Postman: backend/postman/todo-api.postman_collection.json

REST Client: backend/requests/todos.http

The API resources cover authentication, Google login, password reset, todo CRUD, validation/error cases, logout and AI todo generation.

## Local setup

Create backend/.env and frontend/.env from the provided examples. Keep all secrets out of Git.

Backend:

```bash
cd backend
npm ci
npm run dev
```

Frontend, in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Build verification:

```bash
cd backend
npm run build
npm test

cd ../frontend
npm run build
```

## CI

Every push or pull request to development runs:

- backend npm ci
- backend TypeScript build
- backend Vitest unit tests
- frontend npm ci
- frontend production build

## Environment variables

Backend uses:

- MONGODB_URL
- JWT_SECRET
- REDIS_URL
- EMAIL
- EMAIL_PASS
- GEMINI_API_KEY
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

Frontend uses the Vite API/Firebase variables from frontend/.env.example.

Never commit .env files, Firebase private keys, MongoDB credentials or other secrets.
