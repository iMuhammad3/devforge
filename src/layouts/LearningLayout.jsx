import { Outlet } from "react-router-dom";

export default function LearningLayout() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4">
        <h2 className="font-semibold mb-4">Courses</h2>
        <p className="text-sm opacity-70">Navigation coming soon</p>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}