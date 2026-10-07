import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuth } from "../store/authSlice";
import { deleteTodo, fetchTodo, updateTodo } from "../store/todoSlice";

export default function TodoDetails() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const { selected: todo, detailLoading, error } = useAppSelector((state) => state.todos);

  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (!initialized) void dispatch(checkAuth());
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && !user) {
      window.location.href = "/login.html";
    }
  }, [initialized, user]);

  useEffect(() => {
    if (user && id) void dispatch(fetchTodo(id));
  }, [dispatch, user, id]);

  const toggle = async () => {
    if (!todo) return;
    await dispatch(updateTodo({
      id: todo._id,
      data: { completed: !todo.completed },
    }));
  };

  const remove = async () => {
    if (!todo || !window.confirm("Delete this todo?")) return;

    const result = await dispatch(deleteTodo(todo._id));
    if (deleteTodo.fulfilled.match(result)) {
      window.location.href = "/";
    }
  };

  if (!initialized || !user || detailLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        Loading todo...
      </main>
    );
  }

  if (!id) {
    return (
      <main className="mx-auto min-h-screen w-[min(900px,calc(100%-32px))] py-10">
        <a className="text-sm font-semibold text-indigo-600" href="/">← Back to todos</a>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Todo id is missing from the URL.
        </div>
      </main>
    );
  }

  if (error || !todo) {
    return (
      <main className="mx-auto min-h-screen w-[min(900px,calc(100%-32px))] py-10">
        <a className="text-sm font-semibold text-indigo-600" href="/">← Back to todos</a>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Todo not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-[min(900px,calc(100%-32px))] py-8 sm:py-12">
        <a className="text-sm font-semibold text-indigo-600 hover:text-indigo-500" href="/">
          ← Back to todos
        </a>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Todo details</p>
              <h1 className={`mt-2 text-3xl font-black tracking-tight ${todo.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                {todo.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${todo.priority === "high" ? "bg-red-50 text-red-700" : todo.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {todo.priority}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {todo.completed ? "Completed" : "Active"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => void toggle()}
              >
                {todo.completed ? "Reopen" : "Complete"}
              </button>
              <button
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                onClick={() => void remove()}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">
              {todo.description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-slate-400">Created</p>
              <p className="mt-1 font-semibold">{new Date(todo.createdAt).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-slate-400">Updated</p>
              <p className="mt-1 font-semibold">{new Date(todo.updatedAt).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-slate-400">Due date</p>
              <p className="mt-1 font-semibold">
                {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "Not set"}
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
