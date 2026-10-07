import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateTodoInput } from "../types";

interface TodoFormProps {
  onCreate: (todo: CreateTodoInput) => Promise<void>;
  busy?: boolean;
}

export default function TodoForm({ onCreate, busy = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CreateTodoInput["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch {
      // Error is displayed by the page.
    }
  };

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">Task</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="priority">Priority</label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as CreateTodoInput["priority"])}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="dueDate">Due date</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="description">Description</label>
        <textarea
          className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a little more context..."
          maxLength={2000}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Adding..." : "Add todo"}
        </button>
      </div>
    </form>
  );
}
