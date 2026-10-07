interface TodoFiltersProps {
  search: string;
  status: string;
  priority: string;
  sort: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onPriority: (value: string) => void;
  onSort: (value: string) => void;
}

export default function TodoFilters({ search, status, priority, sort, onSearch, onStatus, onPriority, onSort }: TodoFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <input aria-label="Search todos" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search title or description..." className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-slate-300" />
        <select aria-label="Filter by status" value={status} onChange={(e) => onStatus(e.target.value)} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:bg-white focus:ring-slate-300">
          <option value="all">All status</option><option value="active">Active</option><option value="completed">Completed</option>
        </select>
        <select aria-label="Filter by priority" value={priority} onChange={(e) => onPriority(e.target.value)} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:bg-white focus:ring-slate-300">
          <option value="all">All priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
        <select aria-label="Sort todos" value={sort} onChange={(e) => onSort(e.target.value)} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-transparent focus:bg-white focus:ring-slate-300">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Highest priority</option>
        </select>
      </div>
    </section>
  );
}
