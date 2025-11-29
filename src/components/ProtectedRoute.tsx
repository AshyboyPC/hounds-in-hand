import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading, isAdminVerified } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for role-based access using profile from database
  const userRole = profile?.role || "community"; // Default to community for new users

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    // If user is logged in but doesn't have permission, redirect to their dashboard or home
    return <Navigate to="/" replace />;
  }

  // Special check for Admin 2FA
  if (userRole === 'admin' && !isAdminVerified) {
    // If admin is not verified with 2nd password, redirect to login (or a specific verification page)
    // For simplicity, we'll handle the verification in the Login component or a dedicated page
    // But here we block access to dashboard
    return <Navigate to="/login" state={{ needsAdminVerification: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;