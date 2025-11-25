import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  // Optional: show loader until we know user state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // If no user → redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise → show page
  return children;
}
