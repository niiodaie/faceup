import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Camera,
  Sparkles,
  Lock,
  User,
  Clock,
  Star,
} from "lucide-react";
import MoodSelector from "./MoodSelector";
import CutMatchSuggestions from "./CutMatchSuggestions";
import { USER_ROLES, hasAccess } from "../hooks/useUserRole";
import { useSession } from "../hooks/useSession";

/**
 * GuestDemo — new 7-day trial experience
 * - Unlimited scans
 * - No session expiration problems
 * - Shows countdown until trial ends
 * - Encourages Signup / Upgrade
 */
export default function GuestDemo({ onSignUp }) {
  const navigate = useNavigate();
  const { guestTrialEnd } = useSession();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  /**
   * Calculate Days Left in Trial
   */
  const getDaysRemaining = () => {
    if (!guestTrialEnd) return 0;
    const now = Date.now();
    const diff = guestTrialEnd - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();

  useEffect(() => {
    if (daysLeft <= 0) {
      onSignUp(); // trial expired → force sign up
    }
  }, [daysLeft]);

  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
  };

  const handleDemoScan = () => {
    setShowDemo(true);
  };

  const handleFaceScan = () => {
    navigate("/app/face-scan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-3">FACEUP</h1>
          <p className="text-gray-600 text-lg font-medium">
            Be Seen. Be Styled. Be You.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <User className="inline h-3 w-3 mr-1" />
              GUEST • 7-DAY TRIAL
            </span>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Clock className="inline h-3 w-3 mr-1" />
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* Trial Info Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Your Free Trial is Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Enjoy full access to FaceUp for 7 days:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-2">
              <li>• Unlimited face scans</li>
              <li>• Access to all hairstyle suggestions</li>
              <li>• Makeup looks & style analysis</li>
              <li>• Save favorite styles</li>
              <li>• AR try-on (coming soon)</li>
            </ul>
            <Alert className="border-blue-400 bg-blue-50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.  
                Create a free account to save your results.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card className="mb-6 bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-purple-800">
              Try FaceUp Tools
            </CardTitle>
            <CardDescription className="text-gray-600">
              Explore the full experience during your free trial
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleDemoScan}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              <Camera className="h-5 w-5" />
              Try Demo Scan
            </Button>

            <Button
              onClick={handleFaceScan}
              variant="outline"
              className="w-full py-3 rounded-lg font-bold text-lg border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Upload Photo Scan
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
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      Create Free Account
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Save your looks and continue after trial expires.
                  </p>

                  <Button
                    onClick={() => navigate("/auth/signup")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 rounded-lg"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Want to keep your style history?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/auth/signup")}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Sign Up Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="px-6 py-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
