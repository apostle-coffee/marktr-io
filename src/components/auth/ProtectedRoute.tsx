import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!loading && !user) {
      openLogin();
    }
  }, [loading, openLogin, user]);

  if (loading) {
    console.log("ProtectedRoute: waiting for AuthContext…");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-button-green border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/70">Please log in to continue.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
