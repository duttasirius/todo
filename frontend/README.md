# Todo Frontend

React + TypeScript + Vite frontend for the Ziptrrip Todo assignment.

## Stack

- React
- TypeScript
- Vite
- Redux Toolkit + React Redux
- Tailwind CSS
- Framer Motion
- Firebase Authentication

## MPA pages

- / — authenticated Todo list
- /login.html — email/password and Google login
- /register.html — email/password and Google registration
- /create.html — create a todo manually or with AI
- /todo.html?id=TODO_ID — single Todo details
- /forgot-password.html — password reset by email OTP

The app intentionally uses separate HTML entry points and does not use React Router.

## Features

- Register, login and logout
- Google authentication through Firebase
- Authenticated Todo list
- Create, edit, complete/reopen and delete todos
- Todo details page using the required id query parameter
- Search, status filter, priority filter and sorting
- AI-assisted todo creation
- Password reset with six-digit email OTP
- Redux Toolkit state management
- Tailwind CSS styling
- HttpOnly-cookie based authentication through the backend

## Development

```bash
npm ci
npm run dev
```

Set VITE_API_URL and the VITE_FIREBASE_* variables in .env when needed.
