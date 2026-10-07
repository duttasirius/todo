# Todo — Ziptrrip Technical Assignment

A TypeScript Todo application with an Express/MongoDB backend and a React/Vite multi-page frontend.

## Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, TypeScript, MongoDB, JWT, Redis-ready configuration
- API testing: Postman collection + VS Code REST Client requests

## Frontend MPA

The frontend intentionally uses multiple HTML entry points instead of a client-side SPA router, matching the assignment requirement.

| Page | Entry | API responsibility |
| --- | --- | --- |
| Login | `/login.html` | `POST /api/auth/login` |
| Register | `/register.html` | `POST /api/auth/register` |
| Todo list | `/` | `GET /api/todos`, update/delete |
| Create todo | `/create.html` | `POST /api/todos` |
| Todo details | `/todo.html?id=<todoId>` | `GET/PATCH/DELETE /api/todos/:id` |

Each page mounts its own React entry and shares API/state modules through Redux Toolkit.

## Environment

Create `backend/.env`:

```env
PORT=8000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://localhost:6379
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Never commit real secrets. Use the provided `.env.example` files.

## Run locally

```bash
cd backend
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## API flow

1. Register a user.
2. Login; the backend stores the JWT in an HTTP-only cookie.
3. The authenticated pages call `/api/auth/me` to restore the session.
4. Todo pages call the Todo CRUD APIs with credentials included.
5. The Todo details page reads the required `id` query parameter.

## API testing files

- `backend/postman/todo-api.postman_collection.json`
- `backend/requests/todos.http`

## Verification

The GitHub Actions workflow builds both applications on pushes and pull requests to `development`.
