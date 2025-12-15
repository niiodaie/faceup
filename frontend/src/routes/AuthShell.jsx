import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { useSession } from "../hooks/useSession";

export default function AuthShell() {
  const { isAuthenticated, loading } = useSession();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route index element={<LoginPage />} />
    </Routes>
  );
}
