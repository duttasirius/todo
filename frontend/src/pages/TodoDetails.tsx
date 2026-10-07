import { useEffect, useState } from "react";
import { todoApi } from "../services/api";
import type { Todo } from "../types";

export default function TodoDetails() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
      setError("Todo id is missing");
      setLoading(false);
      return;
    }

    const loadTodo = async () => {
      try {
        const response = await todoApi.get(id);
        setTodo(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load todo");
      } finally {
        setLoading(false);
      }
    };

    void loadTodo();
  }, []);

  const toggle = async () => {
    if (!todo) return;

    try {
      const response = await todoApi.update(todo._id, {
        completed: !todo.completed,
      });
      setTodo(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update todo");
    }
  };

  const remove = async () => {
    if (!todo || !window.confirm("Delete this todo?")) return;

    try {
      await todoApi.remove(todo._id);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete todo");
    }
  };

  if (loading) return <div className="loading">Loading todo...</div>;

  if (error) {
    return (
      <main className="main container">
        <a className="button button-ghost" href="/">← Back to todos</a>
        <div className="error card" style={{ marginTop: 24 }}>{error}</div>
      </main>
    );
  }

  if (!todo) return null;

  return (
    <main className="main container">
      <a className="button button-ghost" href="/">← Back to todos</a>

      <article className="card detail-card">
        <div className="detail-header">
          <div>
            <h1>{todo.title}</h1>
            <div className="todo-meta">
              <span className={`badge ${todo.priority}`}>{todo.priority}</span>
              <span className="badge">{todo.completed ? "Completed" : "Active"}</span>
            </div>
          </div>

          <div className="todo-actions">
            <button className="button button-secondary" onClick={() => void toggle()}>
              {todo.completed ? "Reopen" : "Complete"}
            </button>
            <button className="button button-danger" onClick={() => void remove()}>
              Delete
            </button>
          </div>
        </div>

        <p className="detail-description">
          {todo.description || "No description provided."}
        </p>

        <div className="todo-meta">
          <span className="badge">Created {new Date(todo.createdAt).toLocaleString()}</span>
          <span className="badge">Updated {new Date(todo.updatedAt).toLocaleString()}</span>
          {todo.dueDate && (
            <span className="badge">Due {new Date(todo.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </article>
    </main>
  );
}
