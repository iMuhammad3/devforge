import { Link } from "react-router-dom";
import { BookOpen, Settings, User } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const displayName =
    profile?.displayName || user?.displayName || "DevForge User";

  const email = profile?.email || user?.email;
  const photoURL = profile?.photoURL || user?.photoURL;
  const username = profile?.username;
  const bio = profile?.bio;

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-3xl font-semibold">
              {displayName.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <p className="text-sm font-medium text-primary">Profile</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {displayName}
            </h1>

            {username && (
              <p className="mt-1 text-sm text-muted-foreground">
                @{username}
              </p>
            )}

            <p className="mt-2 text-sm text-muted-foreground">{email}</p>
          </div>

          <Link
            to="/settings"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Edit profile
          </Link>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <h2 className="font-semibold">About</h2>

          {bio ? (
            <p className="mt-3 leading-7 text-muted-foreground">{bio}</p>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">
                No bio added yet. Add one in your settings to personalize your
                profile.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ProfileInfoCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Learning activity"
          description="Completed lessons and learning history will appear here later."
        />

        <ProfileInfoCard
          icon={<User className="h-5 w-5" />}
          title="Public profile"
          description="Later, this profile can be shared using your username."
        />
      </div>
    </section>
  );
}

function ProfileInfoCard({ icon, title, description }) {
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