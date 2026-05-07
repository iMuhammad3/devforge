import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b border-border flex items-center px-6">
        <h1 className="font-bold">DevForge</h1>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="h-16 border-t border-border flex items-center px-6 text-sm opacity-70">
        © {new Date().getFullYear()} DevForge
      </footer>
    </div>
  );
}