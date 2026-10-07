import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AuthShell from "../components/AuthShell";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email },
      );

      setMessage(response.data.message);
      setStep("code");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Could not send reset code"
          : "Could not send reset code",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verify-reset-code`,
        { email, otp },
      );

      setMessage(response.data.message);
      setStep("password");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Invalid reset code"
          : "Invalid reset code",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { email, password },
      );

      setMessage(response.data.message);

      window.setTimeout(() => {
        window.location.assign("/login.html");
      }, 900);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Could not reset password"
          : "Could not reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={
        step === "email"
          ? "Forgot your password?"
          : step === "code"
            ? "Check your email."
            : "Choose a new password."
      }
      subtitle={
        step === "email"
          ? "We'll send a one-time code to your account email."
          : step === "code"
            ? `Enter the 6-digit code sent to ${email}.`
            : "Your new password will be used for future sign-ins."
      }
      footer={
        <a href="/login.html" className="font-bold text-white hover:text-indigo-300">
          ← Back to sign in
        </a>
      }
    >
      {message && (
        <div className="mb-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={submitEmail} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60"
            />
          </label>

          <motion.button
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Sending code..." : "Send reset code"}
          </motion.button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={submitCode} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              6-digit code
            </span>
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              placeholder="000000"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-center text-lg font-black tracking-[0.35em] outline-none transition placeholder:text-slate-700 focus:border-indigo-400/60"
            />
          </label>

          <motion.button
            whileTap={{ scale: 0.99 }}
            disabled={loading || otp.length !== 6}
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify code"}
          </motion.button>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-xs font-bold text-slate-400 hover:text-white"
          >
            Use a different email
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={submitPassword} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              New password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              placeholder="Minimum 6 characters"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Confirm password
            </span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              placeholder="Repeat your new password"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60"
            />
          </label>

          <motion.button
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </motion.button>
        </form>
      )}
    </AuthShell>
  );
}
