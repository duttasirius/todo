import { useState } from "react";
import type { FormEvent } from "react";
import { authApi } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login({ email, password });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="card auth-card">
        <a className="brand" href="/">Todo</a>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your tasks.</p>

        <form className="auth-form" onSubmit={submit}>
          {error && <div className="error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </div>

          <button className="button button-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register.html">Register</a>
        </p>
      </section>
    </main>
  );
}
