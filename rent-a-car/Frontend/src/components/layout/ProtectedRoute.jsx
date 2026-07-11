import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  // if (role && user?.role) {
  //   const allowedRoles = Array.isArray(role) ? role : [role];
  //   if (!allowedRoles.includes(user.role)) {
  //     return <Navigate to="/login" replace />;
  //   }
  // }

  return <Outlet />;
}

export default ProtectedRoute;
