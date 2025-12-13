import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';
import { useEntitlements } from '../hooks/useEntitlements';

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
import ResultsPage from '../pages/ResultsPage';

export default function AppShell() {
  const navigate = useNavigate();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(null);

  const {
    user,
    loading,
    isGuest,
    guestTrialEnd,
    signOut,
    disableGuestMode,
  } = useSession();

  const { entitlements, loading: entitlementsLoading } = useEntitlements();
  const userRole = entitlements?.plan || 'free';

  /* =====================================================
     AUTO-EXPIRE GUEST TRIAL
     ===================================================== */
  useEffect(() => {
    if (isGuest && guestTrialEnd && Date.now() >= guestTrialEnd) {
      disableGuestMode();
      navigate('/auth/signup');
    }
  }, [isGuest, guestTrialEnd, disableGuestMode, navigate]);

  /* =====================================================
     AUTH + ENTITLEMENT GUARDS
     ===================================================== */
  if (loading || entitlementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/auth/login" replace />;
  }

  /* =====================================================
     GUEST MODE
     ===================================================== */
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

  /* =====================================================
     HANDLERS
     ===================================================== */
  const handleFaceScan = async () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  /* =====================================================
     APP ROUTES
     ===================================================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-md mx-auto">
              <Header
                currentLanguage={currentLanguage}
                onLanguageToggle={() =>
                  setCurrentLanguage((l) => (l === 'EN' ? 'ES' : 'EN'))
                }
                user={user}
                userRole={userRole}
                onLogout={handleLogout}
              />

              <main className="px-4 pb-8">
                <FaceScanCard
                  onFaceScan={handleFaceScan}
                  isScanning={isScanning}
                />

                <MoodSelector
                  selectedMoods={selectedMoods}
                  onMoodToggle={(m) =>
                    setSelectedMoods((prev) =>
                      prev.includes(m)
                        ? prev.filter((x) => x !== m)
                        : [...prev, m]
                    )
                  }
                />

                <CutMatchSuggestions
                  selectedMoods={selectedMoods}
                  entitlements={entitlements}
                />

                {showUpgradePrompt && (
                  <UpgradePrompt
                    feature={showUpgradePrompt}
                    onClose={() => setShowUpgradePrompt(null)}
                    onUpgrade={() => navigate('/pricing')}
                  />
                )}

                <AffiliateLinks />
                <SocialShare />
              </main>
            </div>
          }
        />

        <Route path="/results/:sessionId" element={<ResultsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </div>
  );
}
