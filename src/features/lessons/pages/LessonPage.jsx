import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer";

import { fetchLessonBySlug, fetchLessonsByCourseSlug } from "../api/lessonsApi";
import LessonSidebar from "../components/LessonSidebar";
import BookmarkButton from "@/features/bookmarks/components/BookmarkButton";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback";
import { BookOpen } from "lucide-react";

export default function LessonPage() {
    const { courseSlug, lessonSlug } = useParams();

    const [lesson, setLesson] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLessonData = async () => {
            try {
                setStatus("loading");
                setError("");

                const [lessonData, lessonsData] = await Promise.all([
                    fetchLessonBySlug(courseSlug, lessonSlug),
                    fetchLessonsByCourseSlug(courseSlug),
                ]);

                if (!lessonData) {
                    setStatus("not-found");
                    return;
                }

                setLesson(lessonData);
                setLessons(lessonsData);
                setStatus("success");
            } catch (err) {
                console.error(err);
                setError("Failed to load lesson.");
                setStatus("error");
            }
        };

        loadLessonData();
    }, [courseSlug, lessonSlug]);

    const currentIndex = useMemo(() => {
        return lessons.findIndex(item => item.slug === lessonSlug);
    }, [lessons, lessonSlug]);

    const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

    const nextLesson =
        currentIndex >= 0 && currentIndex < lessons.length - 1
            ? lessons[currentIndex + 1]
            : null;

    if (status === "loading") {
  return (
    <LoadingState
      title="Loading lesson"
      description="Preparing your lesson content."
    />
  );
}

    if (status === "not-found") {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <EmptyState
        icon={<BookOpen className="h-5 w-5" />}
        title="Lesson not found"
        description="This lesson does not exist, is unpublished, or the URL is incorrect."
        action={
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Back to course
          </Link>
        }
      />
    </section>
  );
}

    if (status === "error") {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <ErrorState description={error} />
    </section>
  );
}
    return (
        <div className="flex">
            <LessonSidebar
                courseSlug={courseSlug}
                lessons={lessons}
                currentLessonSlug={lessonSlug}
            />

            <article className="min-w-0 flex-1">
                <div className="mx-auto max-w-3xl px-6 py-10">
                    <Link
                        to={`/courses/${courseSlug}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to course
                    </Link>

                    <header className="mt-8 border-b border-border pb-8">
                        <p className="text-sm font-medium text-primary">
                            Lesson {lesson.order}
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight">
                            {lesson.title}
                        </h1>

                        {lesson.description && (
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                {lesson.description}
                            </p>
                        )}

                        <div className="mt-6">
                            <BookmarkButton lesson={lesson} />
                        </div>
                    </header>

                    <div className="mt-8">
                        <MarkdownRenderer content={lesson.content} />
                    </div>

                    <div className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
                        {previousLesson ? (
                            <Link
                                to={`/courses/${courseSlug}/lessons/${previousLesson.slug}`}
                                className="rounded-xl border border-border bg-card p-4 transition hover:bg-muted"
                            >
                                <p className="text-sm text-muted-foreground">
                                    Previous
                                </p>
                                <h3 className="mt-1 font-medium">
                                    {previousLesson.title}
                                </h3>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextLesson && (
                            <Link
                                to={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                                className="rounded-xl border border-border bg-card p-4 text-right transition hover:bg-muted"
                            >
                                <p className="text-sm text-muted-foreground">
                                    Next
                                </p>
                                <h3 className="mt-1 font-medium">
                                    {nextLesson.title}
                                </h3>
                            </Link>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
