import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuth, clearAuthError, register } from "../store/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const { user, loading, initialized, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!initialized) void dispatch(checkAuth());
  }, [dispatch, initialized]);

  useEffect(() => {
    if (user) window.location.href = "/";
  }, [user]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      window.location.href = "/";
    }
  };

  if (user) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md place-items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <a href="/" className="text-sm font-semibold text-indigo-300">← Todo</a>
            <h1 className="mt-5 text-3xl font-bold tracking-tight">Create account</h1>
            <p className="mt-2 text-sm text-slate-300">Create an account and start organizing your tasks.</p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            {error && (
              <div className="rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="name">Name</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-indigo-400"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="email">Email</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-indigo-400"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="password">Password</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-indigo-400"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading || !initialized}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <a className="font-semibold text-indigo-300 hover:text-indigo-200" href="/login.html">
              Login
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
