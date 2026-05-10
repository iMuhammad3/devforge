import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/authStore";
import {
  completeLesson,
  fetchLessonProgress,
  undoLessonComplete,
} from "../api/progressApi";

export default function CompleteLessonButton({ lesson, onProgressChange }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid || !lesson?.id) return;

      try {
        const existingProgress = await fetchLessonProgress(user.uid, lesson.id);
        setProgress(existingProgress);
      } catch (err) {
        console.error(err);
      }
    };

    loadProgress();
  }, [user?.uid, lesson?.id]);

  const handleToggleComplete = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setStatus("saving");

      if (progress) {
        await undoLessonComplete(progress.id);
        setProgress(null);
        onProgressChange?.({ type: "removed", lessonId: lesson.id });
      } else {
        const newProgress = await completeLesson({
          userId: user.uid,
          lessonId: lesson.id,
          courseSlug: lesson.courseSlug,
          lessonSlug: lesson.slug,
        });

        setProgress(newProgress);
        onProgressChange?.({ type: "added", progress: newProgress });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatus("idle");
    }
  };

  const isCompleted = Boolean(progress);

  return (
    <button
      type="button"
      onClick={handleToggleComplete}
      disabled={status === "saving"}
      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isCompleted
          ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
          : "border-border bg-card hover:bg-muted"
      }`}
    >
      {isCompleted ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}

      {isCompleted ? "Completed" : "Mark complete"}
    </button>
  );
}