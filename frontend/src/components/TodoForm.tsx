import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import type { CreateTodoInput } from "../types";

interface TodoFormProps {
  onCreate: (payload: CreateTodoInput) => Promise<void>;
  busy?: boolean;
}

export default function TodoForm({ onCreate, busy = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CreateTodoInput["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("A title is required.");
      return;
    }

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create todo");
    }
  };

  return (
    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-300/30 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Task details</p>
        <h2 className="mt-1 text-xl font-black tracking-tight">Make the next action obvious.</h2>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">{error}</div>}

      <div className="grid gap-4">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to get done?" required className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-slate-400 focus:bg-white/[0.12]" />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Add useful context (optional)" className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-medium leading-6 text-white outline-none placeholder:text-slate-600 focus:border-slate-400 focus:bg-white/[0.12]" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as CreateTodoInput["priority"])} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400">
              <option className="text-slate-900" value="low">Low</option>
              <option className="text-slate-900" value="medium">Medium</option>
              <option className="text-slate-900" value="high">High</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Due date</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400" />
          </label>
        </div>

        <button disabled={busy} className="mt-1 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Saving..." : "Create todo"}
        </button>
      </div>
    </motion.form>
  );
}
