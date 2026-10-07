import type { Todo } from "../types";
import { useState } from "react";
import type { FormEvent } from "react";

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { title?: string; description?: string; priority?: Todo["priority"]; dueDate?: string }) => Promise<void>;
}

export default function TodoCard({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 10) : "");

  const save = async (event: FormEvent) => {
    event.preventDefault();

    await onUpdate(todo._id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
    });

    setEditing(false);
  };

  if (editing) {
    return (
      <article className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
        <form className="space-y-4" onSubmit={save}>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold outline-none focus:border-indigo-500"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
          />
          <textarea
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Todo["priority"])}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save changes
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <a href={`/todo.html?id=${todo._id}`} className="block">
            <h2 className={`text-lg font-bold ${todo.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
              {todo.title}
            </h2>
          </a>

          {todo.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{todo.description}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${todo.priority === "high" ? "bg-red-50 text-red-700" : todo.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              {todo.priority}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {todo.completed ? "Completed" : "Active"}
            </span>
            {todo.dueDate && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                Due {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => void onToggle(todo)}
          >
            {todo.completed ? "Reopen" : "Complete"}
          </button>
          <button
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            onClick={() => void onDelete(todo._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
