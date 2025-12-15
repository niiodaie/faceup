import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './hooks/useSession.jsx';
import './App.css';

// Route Shells
import LandingPage from './routes/LandingPage';
import AppShell from './routes/AppShell';
import AuthShell from './routes/AuthShell';

// Components
import GuestDemo from './components/GuestDemo';
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Guest — NO SESSION */}
      <Route path="/app/guest" element={<GuestDemo />} />

      {/* Authenticated App */}
      <Route
        path="/app/*"
        element={
          <SessionProvider>
            <AppShell />
          </SessionProvider>
        }
      />

      {/* Auth */}
      <Route path="/auth/*" element={<AuthShell />} />

      {/* Legacy */}
      <Route path="/login" element={<AuthShell />} />
      <Route path="/signup" element={<AuthShell />} />
      <Route path="/face-scan" element={<AppShell />} />
      <Route path="/pricing" element={<AppShell />} />
      <Route path="/dashboard" element={<AppShell />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
