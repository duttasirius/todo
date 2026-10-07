import { useState } from "react";
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

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-300/30 sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Quick capture</p>
        <h2 className="mt-1 text-xl font-black tracking-tight">Turn an idea into a task.</h2>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_0.7fr_0.8fr_auto]">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to get done?" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-slate-400 focus:bg-white/[0.12]" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:border-slate-400 focus:bg-white/[0.12]" />
        <select value={priority} onChange={(e) => setPriority(e.target.value as CreateTodoInput["priority"])} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400">
          <option className="text-slate-900" value="low">Low priority</option>
          <option className="text-slate-900" value="medium">Medium priority</option>
          <option className="text-slate-900" value="high">High priority</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400" />
        <button disabled={busy} className="rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Saving..." : "Add todo"}
        </button>
      </div>
    </motion.form>
  );
}
