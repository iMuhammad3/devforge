import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, Eye, EyeOff, Plus } from "lucide-react";

import { fetchAdminLessons, updateAdminLesson } from "../api/adminLessonsApi";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/feedback";

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchAdminLessons();

        setLessons(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError("Failed to load admin lessons.");
        setStatus("error");
      }
    };

    loadLessons();
  }, []);

  const updateLessonInState = (lessonId, updatedFields) => {
    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              ...updatedFields,
            }
          : lesson
      )
    );
  };

  if (status === "loading") {
    return (
      <LoadingState
        title="Loading lessons"
        description="Fetching lessons for admin management."
      />
    );
  }

  if (status === "error") {
    return <ErrorState description={error} />;
  }

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Admin / Lessons</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Manage lessons
          </h1>

          <p className="mt-3 text-muted-foreground">
            Create, organize, and publish lessons for your frontend courses.
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

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons yet"
          description="Create your first lesson and attach it to a course."
          action={
            <Link
              to="/admin/lessons/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New lesson
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_160px_120px_160px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground max-md:hidden">
            <span>Lesson</span>
            <span>Course</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-border">
            {lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                onLessonUpdate={updateLessonInState}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function LessonRow({ lesson, onLessonUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTogglePublished = async () => {
    try {
      setIsUpdating(true);

      const nextPublishedValue = !lesson.published;

      await updateAdminLesson(lesson.id, {
        published: nextPublishedValue,
      });

      onLessonUpdate(lesson.id, {
        published: nextPublishedValue,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update lesson visibility.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_160px_120px_160px] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium">{lesson.title}</h2>

          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Lesson {lesson.order}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {lesson.description}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          /courses/{lesson.courseSlug}/lessons/{lesson.slug}
        </p>
      </div>

      <div className="text-sm text-muted-foreground">
        {lesson.courseTitle || lesson.courseSlug}
      </div>

      <div>
        <button
          type="button"
          onClick={handleTogglePublished}
          disabled={isUpdating}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
            lesson.published
              ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
              : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {lesson.published ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              Published
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Draft
            </>
          )}
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <Link
          to={`/courses/${lesson.courseSlug}/lessons/${lesson.slug}`}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
          title="View public lesson"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>

        <Link
          to={`/admin/lessons/${lesson.id}/edit`}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Link>
      </div>
    </div>
  );
}