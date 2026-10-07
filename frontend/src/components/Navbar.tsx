import type { User } from "../types";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a className="brand" href="/">
          Todo
        </a>

        <div className="nav-actions">
          <span className="user-name">Hi, {user.name}</span>
          <button className="button button-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
