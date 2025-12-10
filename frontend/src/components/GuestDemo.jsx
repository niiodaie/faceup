import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Camera, Sparkles, Lock, User, Clock, Star } from 'lucide-react';
import MoodSelector from './MoodSelector';
import CutMatchSuggestions from './CutMatchSuggestions';
import { USER_ROLES, hasAccess } from '../hooks/useUserRole';

const GuestDemo = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);
  const [guestData, setGuestData] = useState({
    sessionStarted: null,
    scansUsed: 0,
    favoriteLooks: [],
    lastActivity: null,
  });

  // Guest demo limitations
  const MAX_SCANS = 3;
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    // Load guest data from localStorage
    const savedGuestData = localStorage.getItem('faceup_guest_demo');
    if (savedGuestData) {
      const parsed = JSON.parse(savedGuestData);
      setGuestData(parsed);
      
      // Check if session has expired
      if (parsed.sessionStarted && Date.now() - parsed.sessionStarted > SESSION_DURATION) {
        resetGuestSession();
      }
    } else {
      // Initialize new guest session
      initializeGuestSession();
    }
  }, []);

  const initializeGuestSession = () => {
    const newGuestData = {
      sessionStarted: Date.now(),
      scansUsed: 0,
      favoriteLooks: [],
      lastActivity: Date.now(),
    };
    setGuestData(newGuestData);
    localStorage.setItem('faceup_guest_demo', JSON.stringify(newGuestData));
  };

  const resetGuestSession = () => {
    localStorage.removeItem('faceup_guest_demo');
    initializeGuestSession();
  };

  const updateGuestData = (updates) => {
    const updatedData = {
      ...guestData,
      ...updates,
      lastActivity: Date.now(),
    };
    setGuestData(updatedData);
    localStorage.setItem('faceup_guest_demo', JSON.stringify(updatedData));
  };

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleDemoScan = () => {
    if (guestData.scansUsed >= MAX_SCANS) {
      return; // Prevent scan if limit reached
    }

    setShowDemo(true);
    updateGuestData({
      scansUsed: guestData.scansUsed + 1,
    });
  };

  const handleFaceScan = () => {
    navigate('/face-scan');
  };

  const getTimeRemaining = () => {
    if (!guestData.sessionStarted) return 0;
    const elapsed = Date.now() - guestData.sessionStarted;
    const remaining = SESSION_DURATION - elapsed;
    return Math.max(0, Math.floor(remaining / 1000 / 60)); // minutes
  };

  const scansRemaining = MAX_SCANS - guestData.scansUsed;
  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-3">
            FACEUP
          </h1>
          <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <User className="inline h-3 w-3 mr-1" />
              GUEST DEMO
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Clock className="inline h-3 w-3 mr-1" />
              {timeRemaining}m left
            </span>
          </div>
        </div>

        {/* Demo Status Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Demo Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scans remaining:</span>
              <span className="font-bold text-purple-600">{scansRemaining}/{MAX_SCANS}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Session time:</span>
              <span className="font-bold text-blue-600">{timeRemaining} minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(scansRemaining / MAX_SCANS) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-purple-800">Try FaceUp Demo</CardTitle>
            <CardDescription className="text-gray-600">
              Experience our AI-powered style suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scansRemaining > 0 ? (
              <>
                <Button
                  onClick={handleDemoScan}
                  className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Try Demo Scan ({scansRemaining} left)
                </Button>
                
                <Button
                  onClick={handleFaceScan}
                  variant="outline"
                  className="w-full py-3 rounded-lg font-bold text-lg border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Upload Photo Scan
                </Button>
              </>
            ) : (
              <Alert className="border-orange-500 bg-orange-50">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  You've used all your demo scans! Sign up to continue with unlimited access.
                </AlertDescription>
              </Alert>
            )}
            
            {showDemo && (
              <div className="space-y-6 mt-6">
                <MoodSelector 
                  selectedMoods={selectedMoods}
                  onMoodToggle={handleMoodToggle}
                  title="What's today about?"
                />
                
                <CutMatchSuggestions 
                  userRole={USER_ROLES.GUEST} 
                  hasAccess={hasAccess} 
                />
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Upgrade to Premium</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Unlock the full FaceUp experience:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Unlimited face scans</li>
                    <li>• Advanced AI style matching</li>
                    <li>• Save & organize your looks</li>
                    <li>• AR virtual try-on</li>
                    <li>• Personalized recommendations</li>
                    <li>• Priority customer support</li>
                  </ul>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => navigate('/signup')}
                      className="py-2 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      Sign Up Free
                    </Button>
                    <Button
                      onClick={() => navigate('/login')}
                      variant="outline"
                      className="py-2 rounded-lg font-bold border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300"
                    >
                      Log In
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {timeRemaining <= 5 && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your demo session expires in {timeRemaining} minutes. Sign up to save your progress!
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to unlock your full potential?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Sign Up Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="px-6 py-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDemo;

