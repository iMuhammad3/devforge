import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { fetchUserProgress } from "@/features/progress/api/progressApi";
import { fetchLessonsByCourseSlug } from "@/features/lessons/api/lessonsApi";
import { fetchCourseBySlug } from "@/features/courses/api/coursesApi";
import { LoadingState } from "@/shared/components/feedback";

export default function ContinueLearningCard() {
    const user = useAuthStore(state => state.user);

    const [progress, setProgress] = useState([]);
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const loadContinueLearning = async () => {
            if (!user?.uid) return;

            try {
                setStatus("loading");

                const progressData = await fetchUserProgress(user.uid);

                setProgress(progressData);

                const latestProgress = progressData[0];

                if (!latestProgress?.courseSlug) {
                    setStatus("success");
                    return;
                }

                const [courseData, lessonsData] = await Promise.all([
                    fetchCourseBySlug(latestProgress.courseSlug),
                    fetchLessonsByCourseSlug(latestProgress.courseSlug),
                ]);

                setCourse(courseData);
                setLessons(lessonsData);

                setStatus("success");
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        loadContinueLearning();
    }, [user?.uid]);

    const completedLessonIds = useMemo(() => {
        return progress.map(item => item.lessonId);
    }, [progress]);

    const nextLesson = useMemo(() => {
        if (!lessons.length) return null;

        return (
            lessons.find(lesson => !completedLessonIds.includes(lesson.id)) ||
            lessons[0]
        );
    }, [lessons, completedLessonIds]);

    const courseCompleted =
        lessons.length > 0 &&
        lessons.every(lesson => completedLessonIds.includes(lesson.id));
    const completedLessonsInCourse = lessons.filter(lesson =>
        completedLessonIds.includes(lesson.id),
    ).length;

    const totalLessons = lessons.length;

    const progressPercentage =
        totalLessons > 0
            ? Math.round((completedLessonsInCourse / totalLessons) * 100)
            : 0;

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

    if (status === "error") {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                </div>

                <h2 className="text-lg font-semibold">Continue learning</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We couldn’t load your recent progress right now.
                </p>

                <Link
                    to="/courses"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                >
                    Browse courses
                </Link>
            </div>
        );
    }

    if (!progress.length) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                </div>

                <h2 className="text-lg font-semibold">Start learning</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    You haven’t completed any lessons yet. Browse a course and
                    start with your first lesson.
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

    if (!course || !nextLesson) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                </div>

                <h2 className="text-lg font-semibold">
                    Learning progress saved
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your progress is saved. Browse courses to continue learning.
                </p>

                <Link
                    to="/courses"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Browse courses
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {courseCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <BookOpen className="h-5 w-5" />
                )}
            </div>

            <h2 className="text-lg font-semibold">
                {courseCompleted
                    ? "Review completed course"
                    : "Continue learning"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {courseCompleted
                    ? "You’ve completed this course. You can review any lesson again."
                    : "Pick up from the next incomplete lesson in your most recent course."}
            </p>

            <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {course.title}
                    </p>

                    <p className="text-xs font-medium text-primary">
                        {progressPercentage}%
                    </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                    {completedLessonsInCourse} of {totalLessons} lessons
                    completed
                </p>

                <h3 className="mt-4 font-semibold">{nextLesson.title}</h3>

                {nextLesson.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {nextLesson.description}
                    </p>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <Link
                    to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    {courseCompleted ? "Review lesson" : "Continue lesson"}
                    <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                >
                    View course
                </Link>
            </div>
        </div>
    );
}
