import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';
import { useUserRole, hasAccess } from '../hooks/useUserRole';

// Components
import Header from '../components/Header';
import FaceScanCard from '../components/FaceScanCard';
import MoodSelector from '../components/MoodSelector';
import CutMatchSuggestions from '../components/CutMatchSuggestions';
import UpgradePrompt from '../components/UpgradePrompt';
import AffiliateLinks from '../components/AffiliateLinks';
import SocialShare from '../components/SocialShare';
import GuestDemo from '../components/GuestDemo';

// Pages
import FaceScanPage from '../FaceScanPage';
import PricingPage from '../pages/pricing';
import Dashboard from '../pages/dashboard';
import ScanPage from '../pages/scan';
import ResultsPage from '../pages/results';

/**
 * AppShell - Main application shell for /app/*
 * Handles all app-related routes and functionality
 * Requires authentication or guest mode
 */
export default function AppShell() {
  const navigate = useNavigate();
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [capturedImage, setCapturedImage] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(null);

  const { 
    session, 
    user, 
    loading, 
    isGuest, 
    userRole, 
    signOut, 
    enableGuestMode, 
    disableGuestMode 
  } = useSession();

  // Redirect to auth if not authenticated and not guest
  if (!loading && !user && !isGuest) {
    return <Navigate to="/auth/login" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleFaceScan = async (imageFile) => {
    setIsScanning(true);
    try {
      // Face scan logic here
      console.log('Scanning face...', imageFile);
    } catch (error) {
      console.error('Face scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCaptureImage = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'EN' ? 'ES' : 'EN');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // If in guest mode, show guest demo
  if (isGuest) {
    return (
      <Routes>
        <Route path="/*" element={<GuestDemo onSignUp={() => enableGuestMode()} />} />
      </Routes>
    );
  }

  // Main app routes for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Routes>
        {/* Main app dashboard */}
        <Route path="/" element={
          <div className="max-w-md mx-auto">
            <Header
              onLanguageToggle={handleLanguageToggle}
              currentLanguage={currentLanguage}
              session={session}
              user={user}
              userRole={userRole}
              onLogout={handleLogout}
            />

            <main className="px-4 pb-8">
              <div className="main-card-wrapper p-6 mx-2 mb-8">
                <div className="text-center mb-8">
                  <h1 className="text-5xl font-bold gradient-text mb-3">FACEUP</h1>
                  <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
                  {userRole && (
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        userRole === 'pro' ? 'bg-purple-100 text-purple-800' :
                        userRole === 'free' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userRole.toUpperCase()} USER
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <FaceScanCard
                    onFaceScan={handleFaceScan}
                    onCapture={handleCaptureImage}
                    isScanning={isScanning}
                    userRole={userRole}
                    hasAccess={hasAccess}
                  />

                  {capturedImage && (
                    <div className="flex justify-center">
                      <div className="polaroid-frame">
                        <img
                          src={capturedImage}
                          alt="Captured face"
                          className="w-32 h-40 object-cover rounded"
                        />
                      </div>
                    </div>
                  )}

                  <MoodSelector
                    selectedMoods={selectedMoods}
                    onMoodToggle={handleMoodToggle}
                    title="What's today about?"
                  />

                  <CutMatchSuggestions
                    userRole={userRole}
                    hasAccess={hasAccess}
                    selectedMoods={selectedMoods}
                  />

                  {showUpgradePrompt && (
                    <UpgradePrompt
                      feature={showUpgradePrompt}
                      onClose={() => setShowUpgradePrompt(null)}
                      onUpgrade={() => navigate('/app/pricing')}
                    />
                  )}

                  <AffiliateLinks />
                  <SocialShare />
                </div>
              </div>
            </main>

            <a
              href="https://visnec.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-4 right-4 z-50 group"
              title="Powered by VNX"
            >
              <img
                src="/vnx-icon.png"
                alt="VNX"
                className="w-8 h-8 opacity-50 hover:opacity-100 transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
              />
            </a>
          </div>
        } />

        {/* App sub-routes */}
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/face-scan" element={<FaceScanPage />} />
        <Route path="/results/:sessionId" element={<ResultsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all for /app/* */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </div>
  );
}
