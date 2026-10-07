import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import type { CreateTodoInput } from "../types";

interface TodoFormProps {
  onCreate: (payload: CreateTodoInput) => Promise<void>;
  busy?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function TodoForm({ onCreate, busy = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CreateTodoInput["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("ai") === "1") {
      setAiOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const generateWithAI = async () => {
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setAiError("");
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/todo`,
        { prompt: aiPrompt.trim() },
        { withCredentials: true },
      );

      const data = response.data.data;

      setTitle(data.title || "");
      setDescription(data.description || "");
      setPriority(data.priority || "medium");
      setDueDate(data.dueDate || "");
      setAiPrompt("");
      setAiOpen(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not generate the Todo with AI."
        : "Could not generate the Todo with AI.";

      setAiError(message);
    } finally {
      setAiLoading(false);
    }
  };

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
      setAiPrompt("");
      setAiError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create todo");
    }
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-300/30 sm:p-6"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Task details
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight">
              Make the next action obvious.
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setAiError("");
              setAiOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-300/30 bg-indigo-400/10 px-4 py-3 text-sm font-black text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-200/50 hover:bg-indigo-400/20"
          >
            <span aria-hidden="true">✨</span>
            Create with AI
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-slate-400 focus:bg-white/[0.12]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add useful context (optional)"
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-medium leading-6 text-white outline-none placeholder:text-slate-600 focus:border-slate-400 focus:bg-white/[0.12]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as CreateTodoInput["priority"])
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400"
              >
                <option className="text-slate-900" value="low">
                  Low
                </option>
                <option className="text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-slate-900" value="high">
                  High
                </option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Due date
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-slate-400"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Saving..." : "Create todo"}
          </button>
        </div>
      </motion.form>

      {aiOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setAiOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-todo-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-300">
                  Gemini assistant
                </p>
                <h3 id="ai-todo-title" className="mt-1 text-2xl font-black tracking-tight">
                  Describe the task. AI handles the structure.
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Gemini will prepare the title, description, priority and due date. You can review everything before saving.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAiOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close AI assistant"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-7">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-indigo-200">
                  What do you need to do?
                </span>
                <textarea
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  maxLength={500}
                  rows={5}
                  autoFocus
                  placeholder="Example: Finish the backend assignment tomorrow, make it high priority and mention Postman testing."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-sm font-medium leading-6 text-white outline-none placeholder:text-slate-500 focus:border-indigo-300/60 focus:bg-white/[0.09]"
                />
              </label>

              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>Maximum 500 characters</span>
                <span>{aiPrompt.length}/500</span>
              </div>

              {aiError && (
                <div className="mt-4 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">
                  {aiError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAiOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void generateWithAI()}
                  disabled={aiLoading || aiPrompt.trim().length < 2}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span aria-hidden="true">✨</span>
                  {aiLoading ? "Generating..." : "Generate Todo"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
