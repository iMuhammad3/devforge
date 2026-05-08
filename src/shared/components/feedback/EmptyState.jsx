import { Inbox } from "lucide-react";

export default function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "There is no content to display right now.",
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon || <Inbox className="h-5 w-5" />}
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}