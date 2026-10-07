import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAuthLoading, setUser } from "../store/authSlice";
import {
  removeTodo,
  replaceTodo,
  setDetailLoading,
  setSelectedTodo,
  setTodoError,
} from "../store/todoSlice";
import type { Todo } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const priorityClass = {
  high: "bg-rose-50 text-rose-700 ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
} as const;

export default function TodoDetails() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const { selected: todo, detailLoading, error } = useAppSelector((state) => state.todos);
  const id = new URLSearchParams(window.location.search).get("id");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");

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
    if (!user || !id) return;

    let active = true;

    const loadTodo = async () => {
      dispatch(setDetailLoading(true));

      try {
        const response = await axios.get(`${API_URL}/api/todos/${id}`, {
          withCredentials: true,
        });

        if (active) dispatch(setSelectedTodo(response.data.data));
      } catch (error) {
        if (active) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Could not load todo"
            : "Could not load todo";

          dispatch(setTodoError(message));
        }
      }
    };

    void loadTodo();

    return () => {
      active = false;
    };
  }, [dispatch, user, id]);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setPriority(todo.priority);
      setDueDate(
        todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : "",
      );
    }
  }, [todo]);

  const completionLabel = useMemo(
    () => (todo?.completed ? "Completed" : "In progress"),
    [todo],
  );

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo) return;

    setSaving(true);

    try {
      const response = await axios.patch(
        `${API_URL}/api/todos/${todo._id}`,
        {
          title: title.trim(),
          description,
          priority,
          dueDate: dueDate || undefined,
        },
        { withCredentials: true },
      );

      dispatch(replaceTodo(response.data.data));
      setEditing(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not update todo"
        : "Could not update todo";

      dispatch(setTodoError(message));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async () => {
    if (!todo) return;

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

  const remove = async () => {
    if (!todo || !window.confirm("Delete this todo?")) return;

    try {
      await axios.delete(`${API_URL}/api/todos/${todo._id}`, {
        withCredentials: true,
      });

      dispatch(removeTodo(todo._id));
      window.location.assign("/");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not delete todo"
        : "Could not delete todo";

      dispatch(setTodoError(message));
    }
  };

  if (!initialized || !user || detailLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] text-sm font-semibold text-slate-400">
        Loading todo…
      </main>
    );
  }

  if (!id || error || !todo) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900">
            ← Back to todos
          </a>
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
            {error || "Todo id is missing or the todo does not exist."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <Navbar user={user} />

      <main className="mx-auto w-[min(980px,calc(100%-32px))] py-8 sm:py-12">
        <a href="/" className="text-sm font-bold text-slate-500 transition hover:text-slate-900">
          ← Back to todos
        </a>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ring-1 ${priorityClass[todo.priority]}`}>
                    {todo.priority} priority
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-300">
                    {completionLabel}
                  </span>
                </div>
                <h1 className={`mt-4 break-words text-3xl font-black tracking-[-0.03em] sm:text-4xl ${todo.completed ? "text-slate-500 line-through" : "text-white"}`}>
                  {todo.title}
                </h1>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => void toggle()}
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-slate-100"
                >
                  {todo.completed ? "Reopen" : "Complete"}
                </button>
                <button
                  onClick={() => setEditing((value) => !value)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>

          {editing ? (
            <form onSubmit={save} className="space-y-5 p-6 sm:p-9">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 font-semibold outline-none focus:border-slate-400" />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3.5 font-medium leading-6 outline-none focus:border-slate-400" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Priority</span>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as Todo["priority"])} className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 font-semibold outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Due date</span>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 font-semibold outline-none focus:border-slate-400" />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button disabled={saving || !title.trim()} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 sm:p-9">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Description</p>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
                  {todo.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Created</p>
                  <p className="mt-2 text-sm font-bold text-slate-700">{new Date(todo.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Updated</p>
                  <p className="mt-2 text-sm font-bold text-slate-700">{new Date(todo.updatedAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Due date</p>
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>

              <button onClick={() => void remove()} className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100">
                Delete todo
              </button>
            </div>
          )}
        </motion.article>
      </main>
    </div>
  );
}
