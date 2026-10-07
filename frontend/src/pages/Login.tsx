import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { getIdToken, signInWithPopup, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import AuthShell from "../components/AuthShell";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { auth, provider } from "../../utils/firebase";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearAuthError,
  initializeAuth,
  setAuthError,
  setAuthLoading,
  setUser,
} from "../store/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });

        if (active) dispatch(setUser(response.data.data));
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
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      dispatch(setUser(response.data.data));
      window.location.assign("/");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Login failed"
        : "Login failed";

      dispatch(setAuthError(message));
    }
  };

  const loginWithGoogle = async () => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));

    try {
      const credential = await signInWithPopup(auth, provider);
      const idToken = await getIdToken(credential.user, true);

      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        { idToken },
        { withCredentials: true },
      );

      dispatch(setUser(response.data.data));
      window.location.assign("/");
    } catch (error) {
      const firebaseCode =
        typeof error === "object" && error !== null && "code" in error
          ? String(error.code)
          : "";

      if (firebaseCode === "auth/popup-closed-by-user") {
        dispatch(setAuthLoading(false));
        return;
      }

      await signOut(auth).catch(() => undefined);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Google login failed"
        : "Google login failed";

      dispatch(setAuthError(message));
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

        <div className="flex justify-end">
          <a href="/forgot-password.html" className="text-xs font-bold text-indigo-300 hover:text-white">
            Forgot password?
          </a>
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.99 }}
          disabled={loading || !initialized}
          className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing you in..." : "Sign in"}
        </motion.button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleAuthButton
        onClick={() => void loginWithGoogle()}
        loading={loading || !initialized}
        label="Continue with Google"
      />
    </AuthShell>
  );
}
