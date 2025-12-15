import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Providers
import { SessionProvider } from "./hooks/useSession.jsx";

// Route Shells
import LandingPage from "./routes/LandingPage";
import AppShell from "./routes/AppShell";
import AuthShell from "./routes/AuthShell";

// Pages / Components
import GuestDemo from "./components/GuestDemo";
import NotFound from "./components/NotFound";

/**
 * App – Routing & Auth Boundary Definition
 *
 * AUTH RULES:
 * 1. Guest routes NEVER touch Supabase / Session
 * 2. Auth routes ALWAYS have SessionProvider
 * 3. App routes ALWAYS have SessionProvider
 */
function App() {
  return (
    <Routes>
      {/* ───────────────────────────────────────────── */}
      {/* Public Landing (NO SESSION) */}
      {/* ───────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />

      {/* ───────────────────────────────────────────── */}
      {/* Guest Mode (NO SESSION, NO SUPABASE) */}
      {/* ───────────────────────────────────────────── */}
      <Route path="/app/guest" element={<GuestDemo />} />

      {/* ───────────────────────────────────────────── */}
      {/* Auth Routes (SESSION REQUIRED) */}
      {/* ───────────────────────────────────────────── */}
      <Route
        path="/auth/*"
        element={
          <SessionProvider>
            <AuthShell />
          </SessionProvider>
        }
      />

      <Route
        path="/login"
        element={
          <SessionProvider>
            <AuthShell />
          </SessionProvider>
        }
      />

      <Route
        path="/signup"
        element={
          <SessionProvider>
            <AuthShell />
          </SessionProvider>
        }
      />

      {/* ───────────────────────────────────────────── */}
      {/* Main App (SESSION REQUIRED) */}
      {/* ───────────────────────────────────────────── */}
      <Route
        path="/app/*"
        element={
          <SessionProvider>
            <AppShell />
          </SessionProvider>
        }
      />

      {/* ───────────────────────────────────────────── */}
      {/* Legacy Routes (SESSION REQUIRED) */}
      {/* ───────────────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <SessionProvider>
            <AppShell />
          </SessionProvider>
        }
      />

      <Route
        path="/pricing"
        element={
          <SessionProvider>
            <AppShell />
          </SessionProvider>
        }
      />

      <Route
        path="/face-scan"
        element={
          <SessionProvider>
            <AppShell />
          </SessionProvider>
        }
      />

      {/* ───────────────────────────────────────────── */}
      {/* 404 */}
      {/* ───────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
