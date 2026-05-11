import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import {
    fetchAdminCourseById,
    fetchAdminCourseBySlug,
    updateAdminCourse,
} from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";
import {
    isValidSlug,
    validatePositiveNumber,
    validateRequired,
} from "@/shared/utils/validation";

export default function AdminEditCoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "HTML",
        level: "Beginner",
        order: 1,
        published: false,
    });

    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadCourse = async () => {
            try {
                setStatus("loading");
                setError("");

                const course = await fetchAdminCourseById(courseId);

                if (!course) {
                    setStatus("not-found");
                    return;
                }

                setFormData({
                    title: course.title || "",
                    slug: course.slug || "",
                    description: course.description || "",
                    category: course.category || "HTML",
                    level: course.level || "Beginner",
                    order: course.order || 1,
                    published: Boolean(course.published),
                });

                setStatus("idle");
            } catch (err) {
                console.error(err);
                setError("Failed to load course.");
                setStatus("error");
            }
        };

        loadCourse();
    }, [courseId]);

    const validateForm = async () => {
        const nextErrors = {};

        const title = formData.title.trim();
        const slug = formData.slug.trim();
        const description = formData.description.trim();

        if (!validateRequired(title)) {
            nextErrors.title = "Course title is required.";
        }

        if (!validateRequired(slug)) {
            nextErrors.slug = "Slug is required.";
        } else if (!isValidSlug(slug)) {
            nextErrors.slug =
                "Slug can only contain lowercase letters, numbers, and hyphens.";
        } else {
            const existingCourse = await fetchAdminCourseBySlug(slug);

            if (existingCourse && existingCourse.id !== courseId) {
                nextErrors.slug = "Another course already uses this slug.";
            }
        }

        if (!validateRequired(description)) {
            nextErrors.description = "Description is required.";
        }

        if (!validatePositiveNumber(formData.order)) {
            nextErrors.order = "Order must be a number greater than 0.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = event => {
        const { name, value } = event.target;

        setErrors(currentErrors => ({
            ...currentErrors,
            [name]: "",
        }));

        setFormData(currentData => ({
            ...currentData,
            [name]: value,
        }));
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

            await updateAdminCourse(courseId, {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim(),
                category: formData.category,
                level: formData.level,
                order: Number(formData.order),
                published: Boolean(formData.published),
            });

            navigate("/admin/courses");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to update course.");
            setStatus("idle");
        }
    };

    if (status === "loading") {
        return (
            <LoadingState
                title="Loading course"
                description="Fetching course details for editing."
            />
        );
    }

    if (status === "error") {
        return <ErrorState description={error} />;
    }

    if (status === "not-found") {
        return (
            <EmptyState
                title="Course not found"
                description="This course does not exist or may have been deleted."
                action={
                    <Link
                        to="/admin/courses"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        Back to courses
                    </Link>
                }
            />
        );
    }

    return (
        <section className="mx-auto max-w-3xl">
            <div className="mb-8">
                <Link
                    to="/admin/courses"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to courses
                </Link>

                <p className="mt-6 text-sm font-medium text-primary">
                    Admin / Edit course
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Edit course
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Update course details, visibility, and ordering.
                </p>
            </div>

            <div className="mb-5">
                <FormMessage type="error">{error}</FormMessage>
            </div>

            <CourseForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={status === "saving"}
                submitLabel="Save changes"
            />
        </section>
    );
}
