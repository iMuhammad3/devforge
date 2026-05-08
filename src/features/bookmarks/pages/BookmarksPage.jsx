import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookOpen } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { fetchUserBookmarks } from "../api/bookmarksApi";

export default function BookmarksPage() {
  const user = useAuthStore((state) => state.user);

  const [bookmarks, setBookmarks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchUserBookmarks(user.uid);

        setBookmarks(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError("Failed to load bookmarks.");
        setStatus("error");
      }
    };

    if (user?.uid) {
      loadBookmarks();
    }
  }, [user?.uid]);

  if (status === "loading") {
    return <p className="text-muted-foreground">Loading bookmarks...</p>;
  }

  if (status === "error") {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Bookmarks</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Saved lessons
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Lessons you bookmark will appear here so you can quickly return to
          them later.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bookmark className="h-5 w-5" />
          </div>

          <h2 className="text-lg font-semibold">No bookmarks yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Open a lesson and click the bookmark button to save it here.
          </p>

          <Link
            to="/courses"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </section>
  );
}

function BookmarkCard({ bookmark }) {
  return (
    <Link
      to={`/courses/${bookmark.courseSlug}/lessons/${bookmark.lessonSlug}`}
      className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:bg-muted"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {bookmark.courseTitle}
          </p>

          <h2 className="mt-1 font-semibold">{bookmark.lessonTitle}</h2>
        </div>
      </div>
    </Link>
  );
}