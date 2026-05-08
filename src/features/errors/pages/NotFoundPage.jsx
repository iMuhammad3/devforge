import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-8 w-8" />
        </div>

        <p className="text-sm font-medium text-primary">404</p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-muted-foreground">
          The page you’re looking for doesn’t exist, was moved, or the URL may
          be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Go home
          </Link>

          <Link
            to="/courses"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted"
          >
            Browse courses
          </Link>
        </div>
      </div>
    </section>
  );
}