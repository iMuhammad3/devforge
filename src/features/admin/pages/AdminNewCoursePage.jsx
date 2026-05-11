import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import { createAdminCourse } from "../api/adminCoursesApi";
import { FormMessage } from "@/shared/components/forms";
import { slugify } from "@/shared/utils/slugify";

const initialFormData = {
  title: "",
  slug: "",
  description: "",
  category: "HTML",
  level: "Beginner",
  order: 1,
  published: false,
};

export default function AdminNewCoursePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setStatus("saving");
      setError("");

      await createAdminCourse({
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
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={status === "saving"}
        submitLabel="Create course"
      />
    </section>
  );
}