import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function AdminLessonsPage() {
  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Admin / Lessons</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Manage lessons
          </h1>

          <p className="mt-3 text-muted-foreground">
            Lesson list and creation tools will be added after course management.
          </p>
        </div>

        <Link
          to="/admin/lessons/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New lesson
        </Link>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">Lesson manager coming soon</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          We’ll build this after course CRUD so lessons can be attached to
          existing courses properly.
        </p>
      </div>
    </section>
  );
}