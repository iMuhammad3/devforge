import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex">
      <aside className="w-64 border-r border-border p-4">
        <h2 className="font-semibold">Dashboard</h2>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}