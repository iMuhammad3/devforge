import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LessonForm from "../components/LessonForm";
import { createAdminLesson } from "../api/adminLessonsApi";
import { fetchAdminCourses } from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";
import { slugify } from "@/shared/utils/slugify";

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

    const handleChange = event => {
        const { name, value } = event.target;

        setFormData(currentData => {
            const nextData = {
                ...currentData,
                [name]: value,
            };

            if (name === "title") {
                nextData.slug = slugify(value);
            }

            return nextData;
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setStatus("saving");
            setError("");

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
