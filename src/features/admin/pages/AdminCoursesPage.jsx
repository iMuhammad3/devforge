import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function AdminCoursesPage() {
  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Admin / Courses</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Manage courses
          </h1>

          <p className="mt-3 text-muted-foreground">
            Course list and creation tools will be added next.
          </p>
        </div>

        <Link
          to="/admin/courses/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New course
        </Link>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">Course manager coming next</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Next, we’ll connect this page to Firestore and display existing
          courses with edit actions.
        </p>
      </div>
    </section>
  );
}