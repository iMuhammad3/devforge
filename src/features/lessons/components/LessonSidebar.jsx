import { Link } from "react-router-dom";

export default function LessonSidebar({
  courseSlug,
  lessons,
  currentLessonSlug,
}) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-background lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Course lessons
          </p>
        </div>

        <nav className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === currentLessonSlug;

            return (
              <Link
                key={lesson.id}
                to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                className={`flex gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {lesson.order}
                </span>

                <span className="line-clamp-2">{lesson.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}