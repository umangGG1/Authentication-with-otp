import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  return token ? <>{children}</> : <Navigate to="/login" />; // Redirect if no token
};

export default ProtectedRoute;
