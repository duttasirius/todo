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

export default function TodoFilters({
  search,
  status,
  priority,
  sort,
  onSearch,
  onStatus,
  onPriority,
  onSort,
}: TodoFiltersProps) {
  const selectClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500";

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[2fr_1fr_1fr_1fr]">
      <input
        className={selectClass}
        placeholder="Search todos..."
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />

      <select className={selectClass} value={status} onChange={(event) => onStatus(event.target.value)}>
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <select className={selectClass} value={priority} onChange={(event) => onPriority(event.target.value)}>
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select className={selectClass} value={sort} onChange={(event) => onSort(event.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}
