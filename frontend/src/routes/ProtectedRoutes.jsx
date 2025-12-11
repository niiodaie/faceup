import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession.jsx";

export default function ProtectedRoutes() {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
