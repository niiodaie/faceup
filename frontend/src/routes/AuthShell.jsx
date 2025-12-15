import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';

import SignUp from '../components/auth/SignUp';
import Login from '../components/auth/Login';
import PhoneAuth from '../components/auth/PhoneAuth';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import AuthCallback from '../pages/auth/callback';

export default function AuthShell() {
  const navigate = useNavigate();
  const { user, isGuest, enableGuestMode } = useSession();

  // ✅ Correct guest handler
  const handleGuestDemo = () => {
    enableGuestMode();
    navigate("/app/guest"); // ✅ FIXED
  };

  // ✅ Authenticated users go to app
  if (user && !isGuest) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Routes>
        <Route
          path="/login"
          element={<Login onGuestDemo={handleGuestDemo} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify-phone" element={<PhoneAuth />} />
        <Route path="/callback" element={<AuthCallback />} />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </div>
  );
}
