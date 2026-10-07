import type { User } from "../types";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      window.location.href = "/login.html";
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-[min(1120px,calc(100%-32px))] items-center justify-between gap-4">
        <a href="/" className="text-xl font-black tracking-tight text-slate-900">
          Todo<span className="text-indigo-600">.</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:block">
            Hi, {user.name}
          </span>
          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => void handleLogout()}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
