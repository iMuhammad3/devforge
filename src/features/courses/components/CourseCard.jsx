import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group block rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {course.category}
        </span>

        <span className="text-xs text-muted-foreground">{course.level}</span>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-card-foreground group-hover:text-primary">
        {course.title}
      </h2>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {course.description}
      </p>
    </Link>
  );
}