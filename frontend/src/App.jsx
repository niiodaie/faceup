import React from "react";
import { Routes, Route } from "react-router-dom";
import { SessionProvider } from "./hooks/useSession.jsx";

// ROUTE SHELLS
import LandingPage from "./routes/LandingPage";
import AppShell from "./routes/AppShell";
import AuthShell from "./routes/AuthShell";
import NotFound from "./components/NotFound";

function App() {
  return (
    <SessionProvider>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Application */}
        <Route path="/app/*" element={<AppShell />} />

        {/* Authentication */}
        <Route path="/auth/*" element={<AuthShell />} />

        {/* Backwards compatibility */}
        <Route path="/login" element={<AuthShell />} />
        <Route path="/signup" element={<AuthShell />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;
