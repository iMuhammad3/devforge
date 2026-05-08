import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchLessonBySlug } from "../api/lessonsApi";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams();

  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setStatus("loading");

        const data = await fetchLessonBySlug(courseSlug, lessonSlug);

        if (!data) {
          setStatus("not-found");
          return;
        }

        setLesson(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson.");
        setStatus("error");
      }
    };

    loadLesson();
  }, [courseSlug, lessonSlug]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link to={`/courses/${courseSlug}`} className="mt-4 inline-block text-primary">
          Back to course
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to={`/courses/${courseSlug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to course
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">Lesson {lesson.order}</p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {lesson.description}
          </p>
        )}
      </header>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>
    </article>
  );
}