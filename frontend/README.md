# Todo Frontend

React + TypeScript + Vite frontend for the Ziptrrip Todo assignment.

## Pages

- `/` - authenticated Todo list page
- `/login.html` - login
- `/register.html` - registration
- `/todo.html?id=<todoId>` - single Todo details page

The project is intentionally implemented as a Vite multi-page application rather than a client-side SPA.

## Run

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the backend is not running at `http://localhost:8000`.
