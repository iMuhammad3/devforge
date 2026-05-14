import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCourseBySlug } from "../api/coursesApi";
import { fetchLessonsByCourseSlug } from "@/features/lessons/api/lessonsApi";
import LessonList from "@/features/lessons/components/LessonList";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";
import { ArrowRight, BookOpen } from "lucide-react";
import { fetchUserCourseProgress } from "@/features/progress/api/progressApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function CourseDetailsPage() {
    const { slug } = useParams();
    const user = useAuthStore(state => state.user);
    const [courseProgress, setCourseProgress] = useState([]);

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
                const progressData = user?.uid
                    ? await fetchUserCourseProgress(user.uid, slug)
                    : [];

                setCourseProgress(progressData);
                setLessons(lessonsData);
                setStatus("success");
            } catch (err) {
                console.error(err);
                setError("Failed to load course.");
                setStatus("error");
            }
        };

        loadCourse();
    }, [slug, user?.uid]);
    const completedCount = courseProgress.length;
    const totalLessons = lessons.length;

    const progressPercentage =
        totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;
    const completedLessonIds = courseProgress.map(item => item.lessonId);

    const nextLesson =
        lessons.find(lesson => !completedLessonIds.includes(lesson.id)) ||
        lessons[0];

    const isCourseCompleted =
        totalLessons > 0 && completedCount === totalLessons;

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

                {totalLessons > 0 && (
                    <div className="mt-8 rounded-2xl border border-border bg-card p-5">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-semibold">
                                            Course progress
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {completedCount} of {totalLessons}{" "}
                                            lessons completed
                                        </p>
                                    </div>

                                    <p className="text-sm font-medium text-primary">
                                        {progressPercentage}%
                                    </p>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {nextLesson && (
                                <Link
                                    to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >
                                    {isCourseCompleted
                                        ? "Review course"
                                        : "Continue learning"}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <LessonList
                        courseSlug={course.slug}
                        lessons={lessons}
                        completedLessonIds={completedLessonIds}
                    />
                </div>
            </div>
        </section>
    );
}
