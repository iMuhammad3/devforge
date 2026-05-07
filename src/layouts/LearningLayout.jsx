import { Outlet } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";

export default function LearningLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border p-4">
          Courses sidebar
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}