import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import { createAdminCourse, fetchAdminCourseBySlug } from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import { slugify } from "@/shared/utils/slugify";
import { isValidSlug, validatePositiveNumber, validateRequired } from "@/shared/utils/validation";

const initialFormData = {
    title: "",
    slug: "",
    description: "",
    category: "Language",
    level: "Beginner",
    order: 1,
    published: false,
};

export default function AdminNewCoursePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

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

            if (existingCourse) {
                nextErrors.slug = "A course with this slug already exists.";
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

            await createAdminCourse({
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim(),
                category: formData.category,
                level: formData.level,
                order: Number(formData.order),
                published: Boolean(formData.published),
                archived: false,
            });

            navigate("/admin/courses");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create course.");
            setStatus("idle");
        }
    };

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
                    Admin / New course
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Create course
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Add a new frontend course to DevForge.
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
                submitLabel="Create course"
            />
        </section>
    );
}
