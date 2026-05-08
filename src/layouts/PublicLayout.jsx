import { Outlet } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}