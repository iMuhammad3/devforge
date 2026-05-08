import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Globe, Loader2 } from "lucide-react";

import { loginWithGoogle } from "@/services/firebase/auth";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Login() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.code || err.message || "Unable to sign in with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-primary">Welcome back</p>

          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to DevForge
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Continue learning frontend development with saved progress,
            bookmarks, and a personalized experience.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              Continue with Google
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          By signing in, you’ll be able to access your dashboard and future
          learning features.
        </p>
      </div>
    </section>
  );
}