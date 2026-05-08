import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { logoutUser } from "@/services/firebase/auth";
import ThemeToggle from "@/shared/components/ThemeToggle";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-sm font-bold tracking-tight">
          DevForge
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <NavItem to="/courses">Courses</NavItem>

          {user && <NavItem to="/dashboard">Dashboard</NavItem>}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User avatar"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}

              <button
                type="button"
                onClick={logoutUser}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "font-medium text-foreground"
          : "text-muted-foreground transition hover:text-foreground"
      }
    >
      {children}
    </NavLink>
  );
}