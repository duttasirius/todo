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

export default function TodoFilters(props: TodoFiltersProps) {
  return (
    <div className="card toolbar">
      <input
        className="field"
        placeholder="Search todos..."
        value={props.search}
        onChange={(event) => props.onSearch(event.target.value)}
      />

      <select value={props.status} onChange={(event) => props.onStatus(event.target.value)}>
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={props.priority}
        onChange={(event) => props.onPriority(event.target.value)}
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={props.sort} onChange={(event) => props.onSort(event.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}
