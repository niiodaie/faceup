import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Provider (SINGLE INSTANCE)
import { SessionProvider } from "./hooks/useSession.jsx";

// Route Shells
import LandingPage from "./routes/LandingPage";
import AppShell from "./routes/AppShell";
import AuthShell from "./routes/AuthShell";

// Pages / Components
import GuestDemo from "./components/GuestDemo";
import NotFound from "./components/NotFound";

/**
 * App – SINGLE auth boundary
 *
 * - SessionProvider is mounted ONCE
 * - Guest logic is handled inside useSession
 * - Routes stay clean
 */
function App() {
  return (
    <SessionProvider>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest Demo */}
        <Route path="/app/guest" element={<GuestDemo />} />

        {/* Auth */}
        <Route path="/auth/*" element={<AuthShell />} />
        <Route path="/login" element={<AuthShell />} />
        <Route path="/signup" element={<AuthShell />} />

        {/* App */}
        <Route path="/app/*" element={<AppShell />} />
        <Route path="/dashboard" element={<AppShell />} />
        <Route path="/pricing" element={<AppShell />} />
        <Route path="/face-scan" element={<AppShell />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;
