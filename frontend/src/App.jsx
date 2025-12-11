import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntroPage from "./components/IntroPage";
import GuestDemo from "./components/GuestDemo";

// Auth pages
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PhoneAuth from "./components/auth/PhoneAuth";
import AuthCallback from "./pages/auth/callback";

// App pages
import FaceScanPage from "./FaceScanPage";
import PricingPage from "./pages/pricing";
import Dashboard from "./pages/dashboard";
import ScanPage from "./pages/scan";
import ResultsPage from "./pages/results";

// Session
import { SessionProvider } from "./hooks/useSession";

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>

          {/* PUBLIC LANDING */}
          <Route path="/" element={<IntroPage />} />

          {/* AUTH ROUTES */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/auth/verify-phone" element={<PhoneAuth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* GUEST DEMO */}
          <Route path="/app" element={<GuestDemo />} />

          {/* MAIN APP PAGES */}
          <Route path="/face-scan" element={<FaceScanPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />

          {/* CATCH ALL */}
          <Route path="*" element={<IntroPage />} />

        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
