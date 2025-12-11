import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession.jsx";

export default function PublicRoutes() {
  const { user, isGuest } = useSession();
  if (user || isGuest) return <Navigate to="/app" replace />;
  return <Outlet />;
}
