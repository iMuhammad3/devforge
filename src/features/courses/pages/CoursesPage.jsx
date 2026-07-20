import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../api/coursesApi";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/feedback";

const COURSE_CATEGORIES = ["All", "Language", "Data Structures", "Algorithms", "Web Development", "Database",];
const COURSE_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

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

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All" || selectedLevel !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  if (status === "loading") {
    return (
      <LoadingState
        title="Loading courses"
        description="Fetching courses from DevForge."
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
          Learn Software Development properly.
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Practical, beginner-friendly courses on C, Python, Data structures and Algorithms.
        </p>
      </div>

      <CourseFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onLevelChange={setSelectedLevel}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mb-5 mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredCourses.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{courses.length}</span>{" "}
          courses
        </p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Add your first course in Firestore to display it here."
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No matching courses"
          description="Try changing your search term, category, or level filter."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

function CourseFilters({
  searchQuery,
  selectedCategory,
  selectedLevel,
  onSearchChange,
  onCategoryChange,
  onLevelChange,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search courses..."
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {COURSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All categories" : category}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(event) => onLevelChange(event.target.value)}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {COURSE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level === "All" ? "All levels" : level}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}