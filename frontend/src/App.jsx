import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
 * Implements clean routing structure:
 * - / = Landing page (IntroPage)
 * - /app/* = Main application
 * - /auth/* = Authentication flows
 * - * = 404 Not Found
 */
function App() {
  return (
    <SessionProvider>
      <Routes>
        {/* Landing Page - Root */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Routes - /app/* */}
        <Route path="/app/*" element={<AppShell />} />
        
        {/* Auth Routes - /auth/* */}
        <Route path="/auth/*" element={<AuthShell />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login" element={<AuthShell />} />
        <Route path="/signup" element={<AuthShell />} />
        <Route path="/face-scan" element={<AppShell />} />
        <Route path="/pricing" element={<AppShell />} />
        <Route path="/dashboard" element={<AppShell />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;
