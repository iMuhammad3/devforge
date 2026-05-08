import { Loader2 } from "lucide-react";

export default function LoadingState({
  title = "Loading...",
  description = "Please wait while we prepare everything.",
}) {
  return (
    <div className="flex min-h-60 items-center justify-center px-6 py-10">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>

        <h2 className="font-semibold">{title}</h2>

        {description && (
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}