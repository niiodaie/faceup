import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';

import SignUp from '../components/auth/SignUp';
import Login from '../components/auth/Login';
import PhoneAuth from '../components/auth/PhoneAuth';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import AuthCallback from '../pages/auth/callback';

/**
 * AuthShell - Handles /auth/* routes
 * Controls Login / Signup / Forgot-password / Phone Auth
 */
export default function AuthShell() {
  const navigate = useNavigate();
  const { user, isGuest, enableGuestMode, disableGuestMode } = useSession();

  // Guest mode handler for Login.jsx
  const handleGuestDemo = () => {
    enableGuestMode();       // switch session to guest mode
    navigate("/app");        // AppShell will detect guest mode and load GuestDemo
  };

  // If in guest mode and entering /auth, disable guest mode
  if (isGuest) {
    disableGuestMode();
  }

  // If authenticated user (not guest), redirect to app
  if (user && !isGuest) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Routes>
        
        {/* Pass guest demo handler to Login */}
        <Route
          path="/login"
          element={<Login onGuestDemo={handleGuestDemo} />}
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify-phone" element={<PhoneAuth />} />
        <Route path="/callback" element={<AuthCallback />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />

      </Routes>
    </div>
  );
}
