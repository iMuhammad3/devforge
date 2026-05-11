export default function FormMessage({ type = "success", children }) {
  if (!children) return null;

  const styles =
    type === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-primary/30 bg-primary/10 text-primary";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}