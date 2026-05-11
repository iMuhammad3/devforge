import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Archive,
    Edit,
    ExternalLink,
    Eye,
    EyeOff,
    Plus,
    RotateCcw,
    Search,
    X,
} from "lucide-react";

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
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

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
        setLessons(currentLessons =>
            currentLessons.map(lesson =>
                lesson.id === lessonId
                    ? {
                          ...lesson,
                          ...updatedFields,
                      }
                    : lesson,
            ),
        );
    };

    const archivedCount = lessons.filter(lesson => lesson.archived).length;

    const courseOptions = useMemo(() => {
        const courseMap = new Map();

        lessons.forEach(lesson => {
            if (!lesson.courseSlug) return;

            courseMap.set(
                lesson.courseSlug,
                lesson.courseTitle || lesson.courseSlug,
            );
        });

        return Array.from(courseMap.entries()).map(([slug, title]) => ({
            slug,
            title,
        }));
    }, [lessons]);

    const visibleLessons = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return lessons.filter(lesson => {
            const matchesArchive = showArchived ? true : !lesson.archived;

            const matchesSearch =
                !query ||
                lesson.title?.toLowerCase().includes(query) ||
                lesson.description?.toLowerCase().includes(query) ||
                lesson.slug?.toLowerCase().includes(query) ||
                lesson.courseSlug?.toLowerCase().includes(query) ||
                lesson.courseTitle?.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "published" &&
                    lesson.published &&
                    !lesson.archived) ||
                (statusFilter === "draft" &&
                    !lesson.published &&
                    !lesson.archived) ||
                (statusFilter === "archived" && lesson.archived);

            const matchesCourse =
                courseFilter === "all" || lesson.courseSlug === courseFilter;

            return (
                matchesArchive &&
                matchesSearch &&
                matchesStatus &&
                matchesCourse
            );
        });
    }, [lessons, searchQuery, statusFilter, courseFilter, showArchived]);

    const hasActiveFilters =
        searchQuery ||
        statusFilter !== "all" ||
        courseFilter !== "all" ||
        showArchived;

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCourseFilter("all");
        setShowArchived(false);
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
                    <p className="text-sm font-medium text-primary">
                        Admin / Lessons
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Manage lessons
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Create, organize, and publish lessons for your frontend
                        courses.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/admin/lessons/new"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        New lesson
                    </Link>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-border bg-card p-4">
                <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search lessons..."
                            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <select
                        value={courseFilter}
                        onChange={event => setCourseFilter(event.target.value)}
                        className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">All courses</option>
                        {courseOptions.map(course => (
                            <option key={course.slug} value={course.slug}>
                                {course.title}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={event => setStatusFilter(event.target.value)}
                        className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">All statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <p>
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {visibleLessons.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">
                            {lessons.length}
                        </span>{" "}
                        lessons
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowArchived(current => !current)}
                        className="text-primary hover:underline"
                    >
                        {showArchived
                            ? "Hide archived"
                            : `Show archived (${archivedCount})`}
                    </button>
                </div>
            </div>

            {visibleLessons.length === 0 ? (
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
                        {visibleLessons.map(lesson => (
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
        if (lesson.archived) {
            alert("Restore this lesson before publishing it.");
            return;
        }

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

    const handleArchiveLesson = async () => {
        const confirmed = window.confirm(
            "Archive this lesson? It will be hidden from public pages and the normal admin list.",
        );

        if (!confirmed) return;

        try {
            setIsUpdating(true);

            await updateAdminLesson(lesson.id, {
                archived: true,
                published: false,
            });

            onLessonUpdate(lesson.id, {
                archived: true,
                published: false,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to archive lesson.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRestoreLesson = async () => {
        const confirmed = window.confirm(
            "Restore this lesson? It will return to the normal admin list as a draft.",
        );

        if (!confirmed) return;

        try {
            setIsUpdating(true);

            await updateAdminLesson(lesson.id, {
                archived: false,
                published: false,
            });

            onLessonUpdate(lesson.id, {
                archived: false,
                published: false,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to restore lesson.");
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

                    {lesson.archived && (
                        <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Archived
                        </span>
                    )}
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
                {!lesson.archived && (
                    <Link
                        to={`/courses/${lesson.courseSlug}/lessons/${lesson.slug}`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                        title="View public lesson"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                )}

                <Link
                    to={`/admin/lessons/${lesson.id}/edit`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Link>
                {lesson.archived ? (
                    <button
                        type="button"
                        onClick={handleRestoreLesson}
                        disabled={isUpdating}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        title="Restore lesson"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleArchiveLesson}
                        disabled={isUpdating}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        title="Archive lesson"
                    >
                        <Archive className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
