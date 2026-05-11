import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  BookOpen,
  Eye,
  EyeOff,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { fetchAdminContentStats } from "../api/adminStatsApi";
import {
  ErrorState,
  LoadingState,
} from "@/shared/components/feedback";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchAdminContentStats();

        setStats(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError("Failed to load admin dashboard stats.");
        setStatus("error");
      }
    };

    loadStats();
  }, []);

  if (status === "loading") {
    return (
      <LoadingState
        title="Loading admin dashboard"
        description="Fetching your content summary."
      />
    );
  }

  if (status === "error") {
    return <ErrorState description={error} />;
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Admin dashboard</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Manage DevForge content
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          View content health, manage published lessons, and continue building
          your frontend learning platform.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">Protected admin area</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Only users with the <span className="font-medium">admin</span>{" "}
              role can access this section. Use it to create, edit, publish,
              draft, and archive DevForge learning content.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentSummaryPanel
          title="Courses"
          description="High-level summary of your course library."
          icon={<BookOpen className="h-5 w-5" />}
          stats={stats.courses}
          primaryAction={{
            label: "New course",
            to: "/admin/courses/new",
          }}
          secondaryAction={{
            label: "Manage courses",
            to: "/admin/courses",
          }}
        />

        <ContentSummaryPanel
          title="Lessons"
          description="High-level summary of your lesson content."
          icon={<FileText className="h-5 w-5" />}
          stats={stats.lessons}
          primaryAction={{
            label: "New lesson",
            to: "/admin/lessons/new",
          }}
          secondaryAction={{
            label: "Manage lessons",
            to: "/admin/lessons",
          }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Recommended next steps</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <AdminAction
            to="/admin/courses/new"
            title="Create a course"
            description="Start a new frontend topic like HTML, CSS, JavaScript, React, or Tailwind."
          />

          <AdminAction
            to="/admin/lessons/new"
            title="Write a lesson"
            description="Use the markdown editor and preview tools to create a polished lesson."
          />

          <AdminAction
            to="/admin/lessons"
            title="Review drafts"
            description="Find draft or archived lessons and prepare them for publishing."
          />
        </div>
      </div>
    </section>
  );
}

function ContentSummaryPanel({
  title,
  description,
  icon,
  stats,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{title}</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Total"
          value={stats.total}
        />

        <StatCard
          icon={<Eye className="h-4 w-4" />}
          label="Published"
          value={stats.published}
        />

        <StatCard
          icon={<EyeOff className="h-4 w-4" />}
          label="Drafts"
          value={stats.drafts}
        />

        <StatCard
          icon={<Archive className="h-4 w-4" />}
          label="Archived"
          value={stats.archived}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={primaryAction.to}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {primaryAction.label}
        </Link>

        <Link
          to={secondaryAction.to}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
        >
          {secondaryAction.label}
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>

      <p className="text-2xl font-bold tracking-tight">{value}</p>

      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
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