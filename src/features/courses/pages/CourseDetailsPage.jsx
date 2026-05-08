import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCourseBySlug } from "../api/coursesApi";
import { fetchLessonsByCourseSlug } from "@/features/lessons/api/lessonsApi";
import LessonList from "@/features/lessons/components/LessonList";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback";
import { BookOpen } from "lucide-react";

export default function CourseDetailsPage() {
    const { slug } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCourse = async () => {
            try {
                setStatus("loading");

                const data = await fetchCourseBySlug(slug);

                if (!data) {
                    setStatus("not-found");
                    return;
                }

                setCourse(data);
                const lessonsData = await fetchLessonsByCourseSlug(slug);
                setLessons(lessonsData);
                setStatus("success");
            } catch (err) {
                console.error(err);
                setError("Failed to load course.");
                setStatus("error");
            }
        };

        loadCourse();
    }, [slug]);

    if (status === "loading") {
  return (
    <LoadingState
      title="Loading course"
      description="Fetching course details and lessons."
    />
  );
}
    if (status === "not-found") {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <EmptyState
        icon={<BookOpen className="h-5 w-5" />}
        title="Course not found"
        description="This course does not exist, is unpublished, or the URL is incorrect."
        action={
          <Link
            to="/courses"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Back to courses
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
        <section className="mx-auto max-w-4xl px-6 py-10">
            <Link to="/courses" className="text-sm text-muted-foreground">
                ← Back to courses
            </Link>

            <div className="mt-8">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {course.category}
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                    {course.title}
                </h1>

                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {course.description}
                </p>

                <div className="mt-8">
                    <LessonList courseSlug={course.slug} lessons={lessons} />
                </div>
            </div>
        </section>
    );
}
