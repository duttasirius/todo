import type { Todo } from "../types";

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoCard({
  todo,
  onToggle,
  onDelete,
}: TodoCardProps) {
  return (
    <article className="card todo-card">
      <div className="todo-main">
        <a href={`/todo.html?id=${todo._id}`}>
          <h2 className={`todo-title ${todo.completed ? "completed" : ""}`}>
            {todo.title}
          </h2>
        </a>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          <span className={`badge ${todo.priority}`}>
            {todo.priority}
          </span>
          <span className="badge">
            {todo.completed ? "Completed" : "Active"}
          </span>
          {todo.dueDate && (
            <span className="badge">
              Due {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="button button-secondary"
          onClick={() => void onToggle(todo)}
        >
          {todo.completed ? "Reopen" : "Complete"}
        </button>

        <button
          className="button button-danger"
          onClick={() => void onDelete(todo._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
