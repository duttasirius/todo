import { useState } from "react";
import type { FormEvent } from "react";
import { authApi } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.register({ name, email, password });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="card auth-card">
        <a className="brand" href="/">Todo</a>
        <h1>Create account</h1>
        <p className="muted">Start organizing your tasks.</p>

        <form className="auth-form" onSubmit={submit}>
          {error && <div className="error">{error}</div>}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </div>

          <button className="button button-primary" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login.html">Login</a>
        </p>
      </section>
    </main>
  );
}
