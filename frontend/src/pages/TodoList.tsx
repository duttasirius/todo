import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TodoCard from "../components/TodoCard";
import TodoFilters from "../components/TodoFilters";
import TodoForm from "../components/TodoForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuth } from "../store/authSlice";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../store/todoSlice";
import type { CreateTodoInput, Todo } from "../types";

const PAGE_SIZE = 6;

export default function TodoList() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const { items: todos, loading, error } = useAppSelector((state) => state.todos);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!initialized) {
      void dispatch(checkAuth());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && !user) {
      window.location.href = "/login.html";
    }
  }, [initialized, user]);

  useEffect(() => {
    if (user) void dispatch(fetchTodos());
  }, [dispatch, user]);

  const filteredTodos = useMemo(() => {
    const rank: Record<Todo["priority"], number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...todos]
      .filter((todo) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          todo.title.toLowerCase().includes(term) ||
          (todo.description || "").toLowerCase().includes(term);

        const matchesStatus =
          status === "all" ||
          (status === "completed" ? todo.completed : !todo.completed);

        const matchesPriority =
          priority === "all" || todo.priority === priority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        if (sort === "priority") {
          return rank[b.priority] - rank[a.priority];
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
    setCreating(true);
    const result = await dispatch(createTodo(payload));
    setCreating(false);

    if (createTodo.fulfilled.match(result)) {
      setPage(1);
    } else {
      throw new Error((result.payload as string) || "Could not create todo");
    }
  };

  const handleToggle = async (todo: Todo) => {
    await dispatch(
      updateTodo({
        id: todo._id,
        data: { completed: !todo.completed },
      }),
    );
  };

  const handleUpdate = async (
    id: string,
    data: { title?: string; description?: string; priority?: Todo["priority"]; dueDate?: string },
  ) => {
    await dispatch(updateTodo({ id, data }));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this todo?")) return;
    await dispatch(deleteTodo(id));
  };

  if (!initialized || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        Checking your session...
      </main>
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={user} />

      <main className="mx-auto w-[min(1120px,calc(100%-32px))] py-8 sm:py-12">
        <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Your workspace</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">My todos</h1>
            <p className="mt-2 text-slate-500">
              {activeCount} active · {completedCount} completed
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-slate-200">
            {todos.length} total
          </div>
        </section>

        <TodoForm onCreate={handleCreate} busy={creating} />

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5">
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
        </div>

        <section className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading todos...
            </div>
          ) : visibleTodos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-lg font-bold">No todos found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Create a todo or change your filters.
              </p>
            </div>
          ) : (
            visibleTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </section>

        {filteredTodos.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
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
