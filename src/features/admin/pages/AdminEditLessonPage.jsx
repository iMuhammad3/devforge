import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import LessonForm from "../components/LessonForm";
import { fetchAdminCourses } from "../api/adminCoursesApi";
import {
  fetchAdminLessonById,
  updateAdminLesson,
} from "../api/adminLessonsApi";
import { FormMessage } from "@/shared/components/forms";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/feedback";

export default function AdminEditLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    order: 1,
    published: false,
  });

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessonData = async () => {
      try {
        setStatus("loading");
        setError("");

        const [coursesData, lessonData] = await Promise.all([
          fetchAdminCourses(),
          fetchAdminLessonById(lessonId),
        ]);

        if (!lessonData) {
          setStatus("not-found");
          return;
        }

        setCourses(coursesData);

        setFormData({
          courseId: lessonData.courseId || "",
          title: lessonData.title || "",
          slug: lessonData.slug || "",
          description: lessonData.description || "",
          content: lessonData.content || "",
          order: lessonData.order || 1,
          published: Boolean(lessonData.published),
        });

        setStatus("idle");
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson.");
        setStatus("error");
      }
    };

    loadLessonData();
  }, [lessonId]);

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

      const selectedCourse = courses.find(
        (course) => course.id === formData.courseId
      );

      if (!selectedCourse) {
        setError("Please select a valid course.");
        setStatus("idle");
        return;
      }

      await updateAdminLesson(lessonId, {
        courseId: selectedCourse.id,
        courseSlug: selectedCourse.slug,
        courseTitle: selectedCourse.title,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        order: Number(formData.order),
        published: Boolean(formData.published),
      });

      navigate("/admin/lessons");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update lesson.");
      setStatus("idle");
    }
  };

  if (status === "loading") {
    return (
      <LoadingState
        title="Loading lesson"
        description="Fetching lesson details for editing."
      />
    );
  }

  if (status === "error") {
    return <ErrorState description={error} />;
  }

  if (status === "not-found") {
    return (
      <EmptyState
        title="Lesson not found"
        description="This lesson does not exist or may have been deleted."
        action={
          <Link
            to="/admin/lessons"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Back to lessons
          </Link>
        }
      />
    );
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
          Admin / Edit lesson
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Edit lesson
        </h1>

        <p className="mt-3 text-muted-foreground">
          Update lesson content, course attachment, ordering, and visibility.
        </p>
      </div>

      <div className="mb-5">
        <FormMessage type="error">{error}</FormMessage>
      </div>

      <LessonForm
        formData={formData}
        courses={courses}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={status === "saving"}
        submitLabel="Save changes"
      />
    </section>
  );
}