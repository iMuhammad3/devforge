import { Link } from "react-router-dom";
import { BookOpen, FileText, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Admin dashboard</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Manage DevForge content
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Create, update, publish, and organize courses and lessons from one
          protected admin area.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <AdminStatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Protected area"
          description="Only users with the admin role can access this dashboard."
        />

        <AdminStatCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Courses"
          description="Course management pages will be added next."
        />

        <AdminStatCard
          icon={<FileText className="h-5 w-5" />}
          title="Lessons"
          description="Lesson creation and editing will come after courses."
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Next admin tasks</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <AdminAction
            to="/admin/courses"
            title="Manage courses"
            description="View, create, and edit course documents."
          />

          <AdminAction
            to="/admin/lessons"
            title="Manage lessons"
            description="View, create, and edit lesson documents."
          />
        </div>
      </div>
    </section>
  );
}

function AdminStatCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AdminAction({ to, title, description }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:bg-muted"
    >
      <h3 className="font-medium">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}