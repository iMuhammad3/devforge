import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
}) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-destructive">{title}</h2>

          {description && (
            <p className="mt-2 text-sm leading-6 text-destructive/80">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}