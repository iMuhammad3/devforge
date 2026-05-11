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

import { fetchAdminCourses, updateAdminCourse } from "../api/adminCoursesApi";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const updateCourseInState = (courseId, updatedFields) => {
        setCourses(currentCourses =>
            currentCourses.map(course =>
                course.id === courseId
                    ? {
                          ...course,
                          ...updatedFields,
                      }
                    : course,
            ),
        );
    };

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setStatus("loading");
                setError("");

                const data = await fetchAdminCourses();

                setCourses(data);
                setStatus("success");
            } catch (err) {
                console.error(err);
                setError("Failed to load admin courses.");
                setStatus("error");
            }
        };

        loadCourses();
    }, []);

    const archivedCount = courses.filter(course => course.archived).length;

    const visibleCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return courses.filter(course => {
            const matchesArchive = showArchived ? true : !course.archived;

            const matchesSearch =
                !query ||
                course.title?.toLowerCase().includes(query) ||
                course.description?.toLowerCase().includes(query) ||
                course.slug?.toLowerCase().includes(query) ||
                course.category?.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "published" &&
                    course.published &&
                    !course.archived) ||
                (statusFilter === "draft" &&
                    !course.published &&
                    !course.archived) ||
                (statusFilter === "archived" && course.archived);

            return matchesArchive && matchesSearch && matchesStatus;
        });
    }, [courses, searchQuery, statusFilter, showArchived]);

    const hasActiveFilters =
        searchQuery || statusFilter !== "all" || showArchived;

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setShowArchived(false);
    };

    if (status === "loading") {
        return (
            <LoadingState
                title="Loading courses"
                description="Fetching courses for admin management."
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
                        Admin / Courses
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Manage courses
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Create and organize frontend courses shown on DevForge.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/admin/courses/new"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        New course
                    </Link>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-border bg-card p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search courses..."
                            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

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
                            {visibleCourses.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">
                            {courses.length}
                        </span>{" "}
                        courses
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

            {visibleCourses.length === 0 ? (
                <EmptyState
                    title="No courses yet"
                    description="Create your first course from the admin dashboard."
                    action={
                        <Link
                            to="/admin/courses/new"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            <Plus className="h-4 w-4" />
                            New course
                        </Link>
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="grid grid-cols-[1fr_120px_160px_190px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground max-md:hidden">
                        <span>Course</span>
                        <span>Level</span>
                        <span>Status</span>
                        <span className="text-right">Actions</span>
                    </div>

                    <div className="divide-y divide-border">
                        {visibleCourses.map(course => (
                            <CourseRow
                                key={course.id}
                                course={course}
                                onCourseUpdate={updateCourseInState}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function CourseRow({ course, onCourseUpdate }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleTogglePublished = async () => {
        if (course.archived) {
            alert("Restore this course before publishing it.");
            return;
        }

        try {
            setIsUpdating(true);

            const nextPublishedValue = !course.published;

            await updateAdminCourse(course.id, {
                published: nextPublishedValue,
            });

            onCourseUpdate(course.id, {
                published: nextPublishedValue,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to update course visibility.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleArchiveCourse = async () => {
        const confirmed = window.confirm(
            "Archive this course? It will be hidden from public pages and the normal admin list.",
        );

        if (!confirmed) return;

        try {
            setIsUpdating(true);

            await updateAdminCourse(course.id, {
                archived: true,
                published: false,
            });

            onCourseUpdate(course.id, {
                archived: true,
                published: false,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to archive course.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRestoreCourse = async () => {
        const confirmed = window.confirm(
            "Restore this course? It will return to the normal admin list as a draft.",
        );

        if (!confirmed) return;

        try {
            setIsUpdating(true);

            await updateAdminCourse(course.id, {
                archived: false,
                published: false,
            });

            onCourseUpdate(course.id, {
                archived: false,
                published: false,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to restore course.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_120px_160px_190px] md:items-center">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{course.title}</h2>

                    {course.category && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {course.category}
                        </span>
                    )}

                    {course.archived && (
                        <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Archived
                        </span>
                    )}
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                    /{course.slug}
                </p>
            </div>

            <div className="text-sm text-muted-foreground">{course.level}</div>

            <div>
                <button
                    type="button"
                    onClick={handleTogglePublished}
                    disabled={isUpdating}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        course.published
                            ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                            : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                    {course.published ? (
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
                {!course.archived && (
                    <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                        title="View public course"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                )}

                <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Link>

                {course.archived ? (
                    <button
                        type="button"
                        onClick={handleRestoreCourse}
                        disabled={isUpdating}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        title="Restore course"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleArchiveCourse}
                        disabled={isUpdating}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        title="Archive course"
                    >
                        <Archive className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
