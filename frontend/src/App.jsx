import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import FaceScanCard from './components/FaceScanCard';
import MoodSelector from './components/MoodSelector';
import CutMatchSuggestions from './components/CutMatchSuggestions';
import ActionButton from './components/ActionButton';
import IntroPage from './components/IntroPage';
import Auth from './components/Auth';
import GuestDemo from './components/GuestDemo';
import UpgradePrompt from './components/UpgradePrompt';
import AffiliateLinks from './components/AffiliateLinks';
import SocialShare from './components/SocialShare';
import NotFound from './components/NotFound';
import FaceScanPage from './FaceScanPage';
import PricingPage from './pages/pricing';
import Dashboard from './pages/dashboard';
import ScanPage from './pages/scan';
import ResultsPage from './pages/results';
import GoogleAnalytics from './components/GoogleAnalytics';
import ProtectedRoute, { AuthenticatedRoute, GuestAllowedRoute, PublicRoute } from './components/ProtectedRoute';

// New authentication components
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import PhoneAuth from './components/auth/PhoneAuth';
import AuthCallback from './pages/auth/callback';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Session management
import { SessionProvider, useSession } from './hooks/useSession.jsx';
import { useUserRole, hasAccess } from './hooks/useUserRole';

function AppContent() {
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

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) setCurrentLanguage(storedLang);
  }, []);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  const handleGuestDemo = () => {
    enableGuestMode();
    navigate('/app');
  };
  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleCaptureImage = (imageBase64) => {
    setCapturedImage(imageBase64);
    console.log("Image captured:", imageBase64);
  };

  const handleLanguageToggle = () => {
    const languages = ['EN', 'ES', 'FR', 'AR'];
    const nextIndex = (languages.indexOf(currentLanguage) + 1) % languages.length;
    const nextLang = languages[nextIndex];
    setCurrentLanguage(nextLang);
    localStorage.setItem('language', nextLang);
  };

  const handleTryAR = () => {
    if (!hasAccess(userRole, 'ar_tryOn')) {
      setShowUpgradePrompt('ar_tryOn');
      return;
    }
    console.log('Navigate to AR try-on');
  };

  const handleUpgrade = () => {
    alert('Upgrade functionality will be implemented in Phase 3 with Stripe integration');
  };

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

  return (
    <>
      <GoogleAnalytics />
      <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <IntroPage onGuestDemo={handleGuestDemo} />
          </PublicRoute>
        }
      />
      
      {/* Authentication Routes */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login onGuestDemo={handleGuestDemo} />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/reset"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/verify-phone"
        element={
          <PublicRoute>
            <PhoneAuth />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />
      
      {/* Legacy auth route for backward compatibility */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth onGuestDemo={handleGuestDemo} />
          </PublicRoute>
        }
      />
      
      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <GuestAllowedRoute>
            {isGuest ? (
              <GuestDemo onSignUp={() => disableGuestMode()} />
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
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

                        <ActionButton onClick={handleTryAR}>
                          SWIPE, SAVE, TRY AR
                        </ActionButton>

                        <AffiliateLinks userRole={userRole} />
                        
                        <SocialShare 
                          title="Check out my FaceUp style transformation!"
                          url={window.location.href}
                        />
                      </div>
                    </div>
                  </main>
                </div>

                {showUpgradePrompt && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowUpgradePrompt(null)}
                        className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
                      >
                        ×
                      </button>
                      <UpgradePrompt
                        feature={showUpgradePrompt}
                        userRole={userRole}
                        onUpgrade={handleUpgrade}
                      />
                    </div>
                  </div>
                )}

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
            )}
          </GuestAllowedRoute>
        }
      />
      
      <Route
        path="/face-scan"
        element={
          <GuestAllowedRoute>
            <FaceScanPage />
          </GuestAllowedRoute>
        }
      />
      
      <Route
        path="/pricing"
        element={
          <GuestAllowedRoute>
            <PricingPage />
          </GuestAllowedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/scan"
        element={
          <GuestAllowedRoute>
            <ScanPage />
          </GuestAllowedRoute>
        }
      />
      
      <Route
        path="/results/:sessionId"
        element={
          <GuestAllowedRoute>
            <ResultsPage />
          </GuestAllowedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </Router>
  );
}

export default App;