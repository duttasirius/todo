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
      // Parent component displays the request error.
    }
  };

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="title">Task</label>
          <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to be done?" maxLength={200} required />
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(event) => setPriority(event.target.value as CreateTodoInput["priority"])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </div>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add some details..." maxLength={2000} />
      </div>

      <div className="form-actions">
        <button className="button button-primary" disabled={busy}>
          {busy ? "Adding..." : "Add Todo"}
        </button>
      </div>
    </form>
  );
}
