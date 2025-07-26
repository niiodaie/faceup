import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, Sparkles, Lock } from 'lucide-react';
import MoodSelector from './MoodSelector';
import CutMatchSuggestions from './CutMatchSuggestions';
import { USER_ROLES, hasAccess } from '../hooks/useUserRole';

const GuestDemo = ({ onSignUp }) => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleDemoScan = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-3">
            FACEUP
          </h1>
          <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              GUEST DEMO
            </span>
          </div>
        </div>

        <Card className="mb-6 bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-purple-800">Try FaceUp Demo</CardTitle>
            <CardDescription className="text-gray-600">
              Experience our AI-powered style suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleDemoScan}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Try Demo Scan
            </Button>
            
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
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Limited Demo</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    This is just a preview! Sign up to unlock full features:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Real face scanning with camera</li>
                    <li>• Unlimited style suggestions</li>
                    <li>• Save your favorite looks</li>
                    <li>• AR try-on experience</li>
                  </ul>
                  <Button
                    onClick={onSignUp}
                    className="w-full py-2 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Sign Up Free
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <Button
            variant="outline"
            onClick={onSignUp}
            className="px-6 py-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestDemo;

