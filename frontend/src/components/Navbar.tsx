import axios from "axios";
import { useAppDispatch } from "../store/hooks";
import { setAuthError, setAuthLoading, setUser } from "../store/authSlice";
import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface NavbarProps {
  user: User;
}

const Logo = () => (
  <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-black text-white shadow-lg shadow-slate-900/10">
    T
  </span>
);

export default function Navbar({ user }: NavbarProps) {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(setAuthLoading(true));

    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );

      dispatch(setUser(null));
      window.location.assign("/login.html");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Logout failed"
        : "Logout failed";

      dispatch(setAuthError(message));
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-sm font-black tracking-tight text-slate-950">Todo</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Focus workspace</p>
          </div>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/create.html" className="hidden rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex">+ New todo</a>
          <div className="hidden h-9 w-px bg-slate-200 sm:block" />
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-400">Signed in as</p>
            <p className="max-w-36 truncate text-sm font-bold text-slate-800">{user.name}</p>
          </div>
          <button onClick={() => void handleLogout()} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Logout
          </button>
        </div>
      </div>
      <div className="mx-auto block w-[min(1180px,calc(100%-32px))] pb-3 sm:hidden">
        <a href="/create.html" className="block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">+ New todo</a>
      </div>
    </header>
  );
}
