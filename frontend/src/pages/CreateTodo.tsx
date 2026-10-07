import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import { createTodoApi } from "../services/createTodoApi";
import { getCurrentUserApi } from "../services/getCurrentUserApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAuthLoading, setUser } from "../store/authSlice";
import { addTodo, setTodoError } from "../store/todoSlice";
import type { CreateTodoInput } from "../types";

export default function CreateTodoPage() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (initialized) return;

    let active = true;

    const restoreSession = async () => {
      dispatch(setAuthLoading(true));

      try {
        const response = await getCurrentUserApi();
        if (active) dispatch(setUser(response.data));
      } catch {
        if (active) {
          dispatch(setAuthLoading(false));
          window.location.assign("/login.html");
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && !user) window.location.assign("/login.html");
  }, [initialized, user]);

  const handleCreate = async (payload: CreateTodoInput) => {
    try {
      const response = await createTodoApi(payload);
      dispatch(addTodo(response.data));
      setCreated(true);
      window.setTimeout(() => window.location.assign("/"), 450);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create todo";
      dispatch(setTodoError(message));
      throw new Error(message);
    }
  };

  if (!initialized || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] text-sm font-semibold text-slate-400">
        Checking your session…
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Navbar user={user} />

      <main className="mx-auto w-[min(900px,calc(100%-32px))] py-8 sm:py-14">
        <a href="/" className="text-sm font-bold text-slate-500 transition hover:text-slate-900">
          ← Back to todos
        </a>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-9">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">New task</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Give the task a clear home.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              A useful title, one line of context and the right priority are usually enough.
            </p>
          </div>

          <div className="p-6 sm:p-9">
            {created && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                Todo created. Taking you back to your list…
              </div>
            )}
            <TodoForm onCreate={handleCreate} />
          </div>
        </motion.section>
      </main>
    </div>
  );
}
