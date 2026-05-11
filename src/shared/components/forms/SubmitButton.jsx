import { Loader2 } from "lucide-react";

export default function SubmitButton({
  children,
  loading = false,
  loadingText = "Saving...",
  disabled = false,
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </button>
  );
}