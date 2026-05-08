import { Link } from "react-router-dom";

export default function LessonList({ courseSlug, lessons }) {
  if (!lessons.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">No lessons yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Lessons for this course will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold">Course lessons</h2>
      </div>

      <div className="divide-y divide-border">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
            className="block p-4 transition hover:bg-muted"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {lesson.order}
              </span>

              <div>
                <h3 className="font-medium">{lesson.title}</h3>

                {lesson.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}