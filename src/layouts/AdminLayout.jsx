import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, FileText, LayoutDashboard } from "lucide-react";

import Navbar from "@/shared/components/Navbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-4">
          <div className="mb-5 border-b border-border pb-4">
            <p className="text-sm font-semibold">Admin</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage DevForge content.
            </p>
          </div>

          <nav className="space-y-1">
            <AdminNavItem to="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
              Overview
            </AdminNavItem>

            <AdminNavItem to="/admin/courses" icon={<BookOpen className="h-4 w-4" />}>
              Courses
            </AdminNavItem>

            <AdminNavItem to="/admin/lessons" icon={<FileText className="h-4 w-4" />}>
              Lessons
            </AdminNavItem>
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}