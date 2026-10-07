import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TodoCard from "../components/TodoCard";
import TodoFilters from "../components/TodoFilters";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAuthLoading, setUser } from "../store/authSlice";
import {
  removeTodo,
  replaceTodo,
  setTodoError,
  setTodos,
  setTodosLoading,
} from "../store/todoSlice";
import type { Todo } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function TodoList() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const { items: todos, loading, error } = useAppSelector((state) => state.todos);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (initialized) return;

    let active = true;

    const restoreSession = async () => {
      dispatch(setAuthLoading(true));

      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });

        if (active) dispatch(setUser(response.data.data));
      } catch {
        if (active) {
          dispatch(setAuthLoading(false));
          window.location.assign("/login.html");
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && !user) window.location.assign("/login.html");
  }, [initialized, user]);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadTodos = async () => {
      dispatch(setTodosLoading(true));

      try {
        const response = await axios.get(`${API_URL}/api/todos`, {
          withCredentials: true,
        });

        if (active) dispatch(setTodos(response.data.data));
      } catch (error) {
        if (active) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Could not load todos"
            : "Could not load todos";

          dispatch(setTodoError(message));
        }
      }
    };

    void loadTodos();

    return () => {
      active = false;
    };
  }, [dispatch, user]);

  const visibleTodos = useMemo(() => {
    const rank: Record<Todo["priority"], number> = { high: 3, medium: 2, low: 1 };
    const term = search.trim().toLowerCase();

    return [...todos]
      .filter((todo) => {
        const text = `${todo.title} ${todo.description || ""}`.toLowerCase();
        const matchesSearch = !term || text.includes(term);
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
        if (sort === "priority") return rank[b.priority] - rank[a.priority];
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, search, status, priority, sort]);

  const handleToggle = async (todo: Todo) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/todos/${todo._id}`,
        { completed: !todo.completed },
        { withCredentials: true },
      );

      dispatch(replaceTodo(response.data.data));
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not update todo"
        : "Could not update todo";

      dispatch(setTodoError(message));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this todo?")) return;

    try {
      await axios.delete(`${API_URL}/api/todos/${id}`, {
        withCredentials: true,
      });

      dispatch(removeTodo(id));
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not delete todo"
        : "Could not delete todo";

      dispatch(setTodoError(message));
    }
  };

  if (!initialized || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] text-sm font-semibold text-slate-400">
        Checking your session…
      </main>
    );
  }

  const completed = todos.filter((todo) => todo.completed).length;
  const active = todos.length - completed;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <Navbar user={user} />

      <main className="mx-auto w-[min(1180px,calc(100%-32px))] py-8 sm:py-12">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-300/40 sm:p-9"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-300">
                Your task space
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Make progress visible.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Keep every task clear, prioritized and easy to pick back up.
              </p>
            </div>
            <a
              href="/create.html"
              className="inline-flex w-fit rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              + Create a todo
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Total tasks", todos.length.toString()],
              ["Active", active.toString()],
              ["Completed", completed.toString()],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="mt-6">
          <TodoFilters
            search={search}
            status={status}
            priority={priority}
            sort={sort}
            onSearch={setSearch}
            onStatus={setStatus}
            onPriority={setPriority}
            onSort={setSort}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <section className="mt-5">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
              ))}
            </div>
          ) : visibleTodos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <p className="text-4xl">✓</p>
              <h2 className="mt-4 text-xl font-black">Nothing here yet.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create a task or loosen your filters. Your next win is probably smaller than you think.
              </p>
              <a href="/create.html" className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">
                Create your first todo
              </a>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
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
        </section>
      </main>
    </div>
  );
}
