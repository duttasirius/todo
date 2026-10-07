import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TodoCard from "../components/TodoCard";
import TodoFilters from "../components/TodoFilters";
import TodoForm from "../components/TodoForm";
import { authApi, todoApi } from "../services/api";
import type { CreateTodoInput, Todo, User } from "../types";

const PAGE_SIZE = 6;

export default function TodoList() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formBusy, setFormBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const loadTodos = async () => {
    const response = await todoApi.list();
    setTodos(response.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const me = await authApi.me();
        setUser(me.data);
        await loadTodos();
      } catch {
        window.location.href = "/login.html";
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredTodos = useMemo(() => {
    const priorityRank = { high: 3, medium: 2, low: 1 };

    return [...todos]
      .filter((todo) => {
        const matchesSearch =
          todo.title.toLowerCase().includes(search.toLowerCase()) ||
          (todo.description || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          status === "all" ||
          (status === "completed" ? todo.completed : !todo.completed);

        const matchesPriority = priority === "all" || todo.priority === priority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        if (sort === "priority") {
          return priorityRank[b.priority] - priorityRank[a.priority];
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, search, status, priority, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));
  const visibleTodos = filteredTodos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleCreate = async (payload: CreateTodoInput) => {
    setError("");
    setFormBusy(true);

    try {
      const response = await todoApi.create(payload);
      setTodos((current) => [response.data, ...current]);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create todo");
      throw err;
    } finally {
      setFormBusy(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    setError("");

    try {
      const response = await todoApi.update(todo._id, {
        completed: !todo.completed,
      });

      setTodos((current) =>
        current.map((item) => (item._id === todo._id ? response.data : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update todo");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this todo?")) return;

    setError("");

    try {
      await todoApi.remove(id);
      setTodos((current) => current.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete todo");
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/login.html";
  };

  if (loading) {
    return <div className="loading">Loading your todos...</div>;
  }

  if (!user) return null;

  return (
    <div className="page">
      <Navbar user={user} onLogout={() => void handleLogout()} />

      <main className="main container">
        <section className="hero">
          <div>
            <h1>My Todos</h1>
            <p className="muted">{todos.filter((todo) => !todo.completed).length} active tasks</p>
          </div>
        </section>

        <TodoForm onCreate={handleCreate} busy={formBusy} />

        {error && <div className="error card">{error}</div>}

        <TodoFilters
          search={search}
          status={status}
          priority={priority}
          sort={sort}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          onStatus={(value) => { setStatus(value); setPage(1); }}
          onPriority={(value) => { setPriority(value); setPage(1); }}
          onSort={(value) => { setSort(value); setPage(1); }}
        />

        {visibleTodos.length === 0 ? (
          <div className="card empty">
            <h2>No todos found</h2>
            <p className="muted">Create a task or change your filters.</p>
          </div>
        ) : (
          <div className="todo-grid">
            {visibleTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {filteredTodos.length > 0 && (
          <div className="pagination">
            <button
              className="button button-secondary"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="button button-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
