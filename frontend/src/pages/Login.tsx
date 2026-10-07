import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import AuthShell from "../components/AuthShell";
import { getCurrentUserApi } from "../services/getCurrentUserApi";
import { loginApi } from "../services/loginApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearAuthError,
  initializeAuth,
  setAuthError,
  setAuthLoading,
  setUser,
} from "../store/authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const { user, loading, initialized, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (initialized) return;

    let active = true;

    const restoreSession = async () => {
      dispatch(setAuthLoading(true));

      try {
        const response = await getCurrentUserApi();
        if (active) dispatch(setUser(response.data));
      } catch {
        if (active) dispatch(initializeAuth());
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [dispatch, initialized]);

  useEffect(() => {
    if (user) window.location.assign("/");
  }, [user]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));

    try {
      const response = await loginApi({ email, password });
      dispatch(setUser(response.data));
      window.location.assign("/");
    } catch (error) {
      dispatch(
        setAuthError(
          error instanceof Error ? error.message : "Login failed",
        ),
      );
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in and get moving."
      subtitle="Your tasks are waiting. Pick up exactly where you left off."
      footer={
        <span>
          New here?{" "}
          <a href="/register.html" className="font-bold text-white hover:text-indigo-300">
            Create an account →
          </a>
        </span>
      }
    >
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Email
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:bg-black/30"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Password
          </span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            minLength={6}
            required
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:bg-black/30"
          />
        </label>

        <motion.button
          whileTap={{ scale: 0.99 }}
          disabled={loading || !initialized}
          className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing you in..." : "Sign in"}
        </motion.button>
      </form>
    </AuthShell>
  );
}
