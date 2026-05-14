export default function LessonTableOfContents({ headings = [] }) {
  if (!headings.length) return null;

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto border-l border-border px-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>

        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={`${heading.id}-${heading.text}`}
              href={`#${heading.id}`}
              className={`block text-sm leading-6 text-muted-foreground transition hover:text-foreground ${
                heading.level === 3 ? "pl-4" : ""
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}