import { Link } from "react-router-dom";
import { BookOpen, Bookmark, Settings, User } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import ContinueLearningCard from "../components/ContinueLearningCard";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
const profile = useAuthStore((state) => state.profile);

  return (
    <section>
      <div className="mb-10">
        <p className="text-sm font-medium text-primary">Dashboard</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back{profile?.displayName ? `, ${profile.displayName}` : ""}.
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Continue learning frontend development, manage your account, and keep
          track of useful lessons as DevForge grows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <UserCard user={user} profile={profile} />

        <div className="grid gap-6">
          <QuickActions />

          <ContinueLearningCard />
        </div>
      </div>
    </section>
  );
}

function UserCard({ user, profile }) {
  const displayName = profile?.displayName || user?.displayName || "DevForge User";
  const email = profile?.email || user?.email;
  const photoURL = profile?.photoURL || user?.photoURL;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col items-center text-center">
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="h-20 w-20 rounded-full"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
            {displayName.charAt(0)}
          </div>
        )}

        <h2 className="mt-4 text-xl font-semibold">{displayName}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{email}</p>

        {profile?.username && (
          <p className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            @{profile.username}
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <Link
          to="/settings"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium transition hover:bg-muted"
        >
          <Settings className="h-4 w-4" />
          Account settings
        </Link>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Quick actions</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <DashboardLink
          to="/courses"
          icon={<BookOpen className="h-5 w-5" />}
          title="Browse courses"
          description="Continue learning frontend topics."
        />

        <DashboardLink
          to="/bookmarks"
          icon={<Bookmark className="h-5 w-5" />}
          title="Bookmarks"
          description="View saved lessons later."
        />

        <DashboardLink
          to="/profile"
          icon={<User className="h-5 w-5" />}
          title="Profile"
          description="Preview your public profile."
        />
      </div>
    </div>
  );
}

function DashboardLink({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:bg-muted"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="font-medium">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

function LearningOverview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Learning overview</h2>

      <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-6 text-center">
        <p className="font-medium">Progress tracking coming soon</p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Later, this area can show completed lessons, saved courses, recent
          activity, and recommended next lessons.
        </p>
      </div>
    </div>
  );
}