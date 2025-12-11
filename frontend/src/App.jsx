import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './hooks/useSession.jsx';
import './App.css';

// Route Shells
import LandingPage from './routes/LandingPage';
import AppShell from './routes/AppShell';
import AuthShell from './routes/AuthShell';

// Components
import NotFound from './components/NotFound';

/**
 * App - Main application component
 */
function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* App Routes */}
          <Route path="/app/*" element={<AppShell />} />

          {/* Auth Routes */}
          <Route path="/auth/*" element={<AuthShell />} />

          {/* Legacy Compat */}
          <Route path="/login" element={<AuthShell />} />
          <Route path="/signup" element={<AuthShell />} />
          <Route path="/face-scan" element={<AppShell />} />
          <Route path="/pricing" element={<AppShell />} />
          <Route path="/dashboard" element={<AppShell />} />

          {/* Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
