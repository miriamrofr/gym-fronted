import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

type Props = { children: React.ReactNode };

const ProtectedRoute = ({
  children,
  requiredRole,
}: Props & { requiredRole: string }) => {
  const location = useLocation();
  const authContext = useAuth();

  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  const { isLoggedIn, user } = authContext;

  return isLoggedIn() && user?.rol === requiredRole ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default ProtectedRoute;
