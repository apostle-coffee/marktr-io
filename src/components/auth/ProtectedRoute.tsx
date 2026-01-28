import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { openLogin } = useAuthModal();
  const params = new URLSearchParams(location.search);
  const allowGuestCheckout =
    location.pathname === "/dashboard" &&
    params.get("checkout") === "success" &&
    Boolean(params.get("guest_ref"));

  useEffect(() => {
    if (!loading && !user && !allowGuestCheckout) {
      openLogin();
    }
  }, [allowGuestCheckout, loading, openLogin, user]);

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
    if (allowGuestCheckout) {
      return <>{children}</>;
    }

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
