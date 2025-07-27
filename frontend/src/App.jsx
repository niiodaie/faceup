import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
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
import { supabase } from './utils/supabaseClient';
import { useUserRole, hasAccess } from './hooks/useUserRole';

function App() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [capturedImage, setCapturedImage] = useState(null);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(null);
  const [guestMode, setGuestMode] = useState(false);

  const { userRole, loading } = useUserRole(user);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) setCurrentLanguage(storedLang);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setGuestMode(false);
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

  const handleGuestDemo = () => {
    setGuestMode(true);
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

 <Router>
  <Routes>
    <Route
      path="/"
      element={
        session ? (
          <Navigate to="/app" />
        ) : (
          <IntroPage onGuestDemo={handleGuestDemo} />
        )
      }
    />
    <Route path="/login" element={<Auth onGuestDemo={handleGuestDemo} />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/guest" element={<GuestDemo onSignUp={() => setGuestMode(false)} />} />

    <Route
      path="/app"
      element={
        session ? (
          guestMode ? (
            <GuestDemo onSignUp={() => setGuestMode(false)} />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
              <div className="max-w-md mx-auto">
                <Header
                  onLanguageToggle={handleLanguageToggle}
                  currentLanguage={currentLanguage}
                  session={session}
                  user={user}
                />
                {/* App content here */}
              </div>
            </div>
          )
        ) : (
          <Navigate to="/login" />
        )
      }
    />

       <Route
          path="/"
          element={
            session ? (
              guestMode ? (
                <GuestDemo onSignUp={() => setGuestMode(false)} />
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
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  userRole === 'pro'
                                    ? 'bg-purple-100 text-purple-800'
                                    : userRole === 'free'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
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
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
