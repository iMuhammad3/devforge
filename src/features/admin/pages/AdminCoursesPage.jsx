import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, Eye, EyeOff, Plus } from "lucide-react";

import { fetchAdminCourses } from "../api/adminCoursesApi";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

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

                <Link
                    to="/admin/courses/new"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    New course
                </Link>
            </div>

            {courses.length === 0 ? (
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
                    <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground max-md:hidden">
                        <span>Course</span>
                        <span>Level</span>
                        <span>Status</span>
                        <span className="text-right">Actions</span>
                    </div>

                    <div className="divide-y divide-border">
                        {courses.map(course => (
                            <CourseRow key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function CourseRow({ course }) {
    return (
        <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_120px_120px_100px] md:items-center">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{course.title}</h2>

                    {course.category && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {course.category}
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
                {course.published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Eye className="h-3 w-3" />
                        Published
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <EyeOff className="h-3 w-3" />
                        Draft
                    </span>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                    title="View public course"
                >
                    <ExternalLink className="h-4 w-4" />
                </Link>

                <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition hover:bg-muted"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Link>
            </div>
        </div>
    );
}
