import { motion } from "framer-motion";
import type { Todo } from "../types";

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityClass = {
  high: "bg-rose-50 text-rose-700 ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
} as const;

export default function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex items-start gap-4">
        <button aria-label={todo.completed ? "Mark todo active" : "Mark todo completed"} onClick={() => onToggle(todo)} className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${todo.completed ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white hover:border-slate-900"}`}>
          {todo.completed ? "✓" : ""}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ring-1 ${priorityClass[todo.priority]}`}>{todo.priority}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{todo.completed ? "Completed" : "Active"}</span>
          </div>
          <h2 className={`mt-3 truncate text-lg font-black tracking-tight ${todo.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>{todo.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{todo.description || "No description added."}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <span>{todo.dueDate ? `Due ${new Date(todo.dueDate).toLocaleDateString()}` : "No due date"}</span><span>•</span><span>Updated {new Date(todo.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a href={`/todo.html?id=${encodeURIComponent(todo._id)}`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">View</a>
          <button onClick={() => onDelete(todo._id)} className="rounded-xl border border-transparent px-3 py-2 text-sm font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50">Delete</button>
        </div>
      </div>
    </motion.article>
  );
}
