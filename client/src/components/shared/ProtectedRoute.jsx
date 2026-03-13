import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import Spinner from "./Spinner.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
