import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';
import { useEntitlements } from '../hooks/useEntitlements';
import AdBanner from '../components/AdBanner';
import { useEntitlements } from '../hooks/useEntitlements';

const { entitlements, loading: entitlementsLoading } = useEntitlements();

if (entitlementsLoading) return null;


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
 * AppShell - Main application for /app/*
 * Supports: Auth users, Free users, Guest Trial users
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
    guestTrialEnd,
    signOut,
    disableGuestMode,
  } = useSession();

  const {
    entitlements,
    loading: entitlementsLoading,
  } = useEntitlements();

  /**
   * AUTO-EXPIRE GUEST TRIAL
   */
  useEffect(() => {
    if (isGuest && guestTrialEnd && Date.now() >= guestTrialEnd) {
      disableGuestMode();
      navigate('/auth/signup');
    }
  }, [isGuest, guestTrialEnd, disableGuestMode, navigate]);

  /**
   * Require Login if no session & not guest
   */
  if (!loading && !user && !isGuest) {
    return <Navigate to="/auth/login" replace />;
  }

  /**
   * Loading State
   */
  if (loading || entitlementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  /**
   * GUEST MODE EXPERIENCE
   */
  if (isGuest) {
    return (
      <Routes>
        <Route
          path="/*"
          element={
            <GuestDemo
              onSignUp={() => {
                disableGuestMode();
                navigate('/auth/signup');
              }}
            />
          }
        />
      </Routes>
    );
  }

  /**
   * Handlers
   */
  const handleFaceScan = async () => {
    setIsScanning(true);
    try {
      console.log('Scanning face…');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCaptureImage = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage((prev) => (prev === 'EN' ? 'ES' : 'EN'));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  /**
   * AUTHENTICATED UI
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-md mx-auto">
              <Header
                onLanguageToggle={handleLanguageToggle}
                currentLanguage={currentLanguage}
                session={session}
                user={user}
                onLogout={handleLogout}
              />

              <main className="px-4 pb-8">
                <div className="main-card-wrapper p-6 mx-2 mb-8">
                  <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold gradient-text mb-3">
                      FACEUP
                    </h1>
                    <p className="text-gray-600 text-lg font-medium">
                      Be Seen. Be Styled. Be You.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <FaceScanCard
                      onFaceScan={handleFaceScan}
                      onCapture={handleCaptureImage}
                      isScanning={isScanning}
                      entitlements={entitlements}
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
                      selectedMoods={selectedMoods}
                      entitlements={entitlements}
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
            </div>
          }
        />

        <Route path="/scan" element={<ScanPage />} />
        <Route path="/face-scan" element={<FaceScanPage />} />
        <Route path="/results/:sessionId" element={<ResultsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </div>
  );
}
