import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/authStore";
import {
  addLessonBookmark,
  fetchLessonBookmark,
  removeLessonBookmark,
} from "../api/bookmarksApi";

export default function BookmarkButton({ lesson }) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const [bookmark, setBookmark] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const loadBookmark = async () => {
      if (!user?.uid || !lesson?.id) return;

      try {
        const existingBookmark = await fetchLessonBookmark(user.uid, lesson.id);
        setBookmark(existingBookmark);
      } catch (err) {
        console.error(err);
      }
    };

    loadBookmark();
  }, [user?.uid, lesson?.id]);

  const handleToggleBookmark = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setStatus("saving");

      if (bookmark) {
        await removeLessonBookmark(bookmark.id);
        setBookmark(null);
      } else {
        const newBookmark = await addLessonBookmark({
          userId: user.uid,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonSlug: lesson.slug,
          courseSlug: lesson.courseSlug,
          courseTitle: lesson.courseTitle || lesson.courseSlug,
        });

        setBookmark(newBookmark);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatus("idle");
    }
  };

  const isBookmarked = Boolean(bookmark);

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      disabled={status === "saving"}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-primary" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}

      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}