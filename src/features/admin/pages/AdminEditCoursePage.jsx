import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import {
  fetchAdminCourseById,
  updateAdminCourse,
} from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/feedback";

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setStatus("saving");
      setError("");

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
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={status === "saving"}
        submitLabel="Save changes"
      />
    </section>
  );
}