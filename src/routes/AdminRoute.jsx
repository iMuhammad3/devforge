import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { LoadingState } from "@/shared/components/feedback";

export default function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <LoadingState
        title="Checking permissions"
        description="Verifying your admin access."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}