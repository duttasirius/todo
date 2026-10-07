# Todo Frontend

React + TypeScript + Vite frontend for the Ziptrrip Todo assignment.

## Stack

- React
- TypeScript
- Vite
- Redux Toolkit + React Redux
- Tailwind CSS

## MPA pages

- `/` — authenticated Todo list
- `/login.html` — login
- `/register.html` — register
- `/todo.html?id=<todoId>` — single Todo details

The app intentionally uses separate HTML entry points and does not use React Router.

## Features

- Register, login and logout
- Authenticated Todo list
- Create, edit, complete/reopen and delete todos
- Todo details page using the required `?id=` query parameter
- Search, status filter, priority filter and sorting
- Pagination
- Redux Toolkit state management
- Tailwind CSS styling
- HttpOnly-cookie based authentication through the backend

## Development

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the backend is not available at `http://localhost:8000`.
