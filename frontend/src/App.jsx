import React from "react";
import { Routes, Route } from "react-router-dom";
import { SessionProvider } from "./hooks/useSession";

import LandingPage from "./routes/LandingPage";
import AppShell from "./routes/AppShell";
import AuthShell from "./routes/AuthShell";
import GuestDemo from "./components/GuestDemo";
import NotFound from "./components/NotFound";

function App() {
  return (
    <SessionProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest (NO AUTH, NO SUPABASE) */}
        <Route path="/app/guest" element={<GuestDemo />} />

        {/* Auth */}
        <Route path="/auth/*" element={<AuthShell />} />
        <Route path="/login" element={<AuthShell />} />
        <Route path="/signup" element={<AuthShell />} />

        {/* Protected App */}
        <Route path="/app/*" element={<AppShell />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;
