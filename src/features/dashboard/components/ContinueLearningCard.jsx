import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

import { fetchUserProgress } from "@/features/progress/api/progressApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { LoadingState } from "@/shared/components/feedback";

export default function ContinueLearningCard() {
  const user = useAuthStore((state) => state.user);

  const [progress, setProgress] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid) return;

      try {
        setStatus("loading");

        const data = await fetchUserProgress(user.uid);

        setProgress(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    loadProgress();
  }, [user?.uid]);

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <LoadingState
          title="Loading progress"
          description="Checking your recent learning activity."
        />
      </div>
    );
  }

  const latestProgress = progress[0];

  if (!latestProgress) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>

        <h2 className="text-lg font-semibold">Start learning</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You haven’t completed any lessons yet. Browse a course and start with
          your first lesson.
        </p>

        <Link
          to="/courses"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Browse courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <h2 className="text-lg font-semibold">Continue learning</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Your most recent completed lesson was from{" "}
        <span className="font-medium text-foreground">
          {latestProgress.courseSlug}
        </span>
        .
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/courses/${latestProgress.courseSlug}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Continue course
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to="/courses"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
        >
          Browse all courses
        </Link>
      </div>
    </div>
  );
}