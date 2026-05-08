import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../api/coursesApi";
import {
    EmptyState,
    ErrorState,
    LoadingState,
} from "@/shared/components/feedback";

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
            <LoadingState
                title="Loading courses"
                description="Fetching frontend courses from DevForge."
            />
        );
    }

    if (status === "error") {
        return (
            <section className="mx-auto max-w-6xl px-6 py-10">
                <ErrorState description={error} />
            </section>
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
                    Practical, beginner-friendly courses on HTML, CSS,
                    JavaScript, React, Tailwind, and modern frontend
                    engineering.
                </p>
            </div>

            {courses.length === 0 ? (
                <EmptyState
                    title="No courses yet"
                    description="Add your first course in Firestore to display it here."
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </section>
    );
}
