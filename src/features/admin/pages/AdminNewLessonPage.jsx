import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LessonForm from "../components/LessonForm";
import {
    createAdminLesson,
    fetchAdminLessonByCourseAndSlug,
} from "../api/adminLessonsApi";
import { fetchAdminCourses } from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";
import { slugify } from "@/shared/utils/slugify";
import {
    isValidSlug,
    validatePositiveNumber,
    validateRequired,
} from "@/shared/utils/validation";
import { useUnsavedChangesWarning } from "@/shared/hooks/useUnsavedChangesWarning";

const initialFormData = {
    courseId: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    order: 1,
    published: false,
};

export default function AdminNewLessonPage() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    useUnsavedChangesWarning(isDirty && status !== "saving");

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setStatus("loading");
                setError("");

                const data = await fetchAdminCourses();
                setCourses(data);

                setFormData(currentData => ({
                    ...currentData,
                    courseId: data[0]?.id || "",
                }));

                setStatus("idle");
            } catch (err) {
                console.error(err);
                setError("Failed to load courses.");
                setStatus("error");
            }
        };

        loadCourses();
    }, []);

    const validateForm = async () => {
        const nextErrors = {};

        const courseId = formData.courseId;
        const title = formData.title.trim();
        const slug = formData.slug.trim();
        const description = formData.description.trim();
        const content = formData.content.trim();

        if (!validateRequired(courseId)) {
            nextErrors.courseId = "Please select a course.";
        }

        if (!validateRequired(title)) {
            nextErrors.title = "Lesson title is required.";
        }

        if (!validateRequired(slug)) {
            nextErrors.slug = "Slug is required.";
        } else if (!isValidSlug(slug)) {
            nextErrors.slug =
                "Slug can only contain lowercase letters, numbers, and hyphens.";
        } else if (courseId) {
            const existingLesson = await fetchAdminLessonByCourseAndSlug(
                courseId,
                slug,
            );

            if (existingLesson) {
                nextErrors.slug =
                    "A lesson with this slug already exists in this course.";
            }
        }

        if (!validateRequired(description)) {
            nextErrors.description = "Description is required.";
        }

        if (!validateRequired(content)) {
            nextErrors.content = "Lesson content is required.";
        }

        if (!validatePositiveNumber(formData.order)) {
            nextErrors.order = "Order must be a number greater than 0.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = event => {
        const { name, value } = event.target;

        setIsDirty(true);

        setErrors(currentErrors => ({
            ...currentErrors,
            [name]: "",
        }));

        setFormData(currentData => {
            const nextData = {
                ...currentData,
                [name]: value,
            };

            if (name === "title") {
                nextData.slug = slugify(value);

                setErrors(currentErrors => ({
                    ...currentErrors,
                    slug: "",
                }));
            }

            return nextData;
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setStatus("saving");
            setError("");

            const isValid = await validateForm();

            if (!isValid) {
                setStatus("idle");
                return;
            }

            const selectedCourse = courses.find(
                course => course.id === formData.courseId,
            );

            if (!selectedCourse) {
                setError("Please select a valid course.");
                setStatus("idle");
                return;
            }

            await createAdminLesson({
                courseId: selectedCourse.id,
                courseSlug: selectedCourse.slug,
                courseTitle: selectedCourse.title,
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim(),
                content: formData.content.trim(),
                order: Number(formData.order),
                published: Boolean(formData.published),
                archived: false,
            });

            setIsDirty(false);
            navigate("/admin/lessons");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create lesson.");
            setStatus("idle");
        }
    };

    if (status === "loading") {
        return (
            <LoadingState
                title="Loading courses"
                description="Preparing lesson creation form."
            />
        );
    }

    if (status === "error") {
        return <ErrorState description={error} />;
    }

    return (
        <section className="mx-auto max-w-4xl">
            <div className="mb-8">
                <Link
                    to="/admin/lessons"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to lessons
                </Link>

                <p className="mt-6 text-sm font-medium text-primary">
                    Admin / New lesson
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Create lesson
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Add a markdown-based lesson to one of your frontend courses.
                </p>
            </div>

            <div className="mb-5">
                <FormMessage type="error">{error}</FormMessage>
            </div>
            {isDirty && (
                <div className="mb-5 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    You have unsaved changes.
                </div>
            )}

            {courses.length === 0 ? (
                <EmptyState
                    title="No courses available"
                    description="Create a course before adding lessons."
                    action={
                        <Link
                            to="/admin/courses/new"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Create course
                        </Link>
                    }
                />
            ) : (
                <LessonForm
                    formData={formData}
                    errors={errors}
                    courses={courses}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isSubmitting={status === "saving"}
                    submitLabel="Create lesson"
                />
            )}
        </section>
    );
}
