import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import GuestRoutes from "./GuestRoutes";

// Pages
import IntroPage from "../components/IntroPage";
import SignUp from "../components/auth/SignUp";
import Login from "../components/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PhoneAuth from "../components/auth/PhoneAuth";
import AuthCallback from "../pages/auth/callback";
import PricingPage from "../pages/pricing";
import Dashboard from "../pages/dashboard";
import ScanPage from "../pages/scan";
import ResultsPage from "../pages/results";
import FaceScanPage from "../FaceScanPage";
import NotFound from "../components/NotFound";

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<IntroPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/auth/verify-phone" element={<PhoneAuth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>

        {/* Guest + Auth */}
        <Route element={<GuestRoutes />}>
          <Route path="/app" element={<FaceScanPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/face-scan" element={<ScanPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
        </Route>

        {/* Auth only */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
