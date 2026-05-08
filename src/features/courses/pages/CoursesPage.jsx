import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../api/coursesApi";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setStatus("loading");

        const data = await fetchCourses();

        setCourses(data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
        setStatus("error");
      }
    };

    loadCourses();
  }, []);

  if (status === "loading") {
    return (
      <div>
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <p className="mb-2 text-sm font-medium text-primary">Courses</p>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Learn frontend development properly.
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Practical, beginner-friendly courses on HTML, CSS, JavaScript, React,
          Tailwind, and modern frontend engineering.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">No courses yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first course in Firestore to display it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}