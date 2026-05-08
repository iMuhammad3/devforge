import { Outlet } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}