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
  User,
  Clock,
  Star,
} from "lucide-react";
import MoodSelector from "./MoodSelector";
import CutMatchSuggestions from "./CutMatchSuggestions";
import { USER_ROLES, hasAccess } from "../hooks/useUserRole";
import { useSession } from "../hooks/useSession";

export default function GuestDemo({ onSignUp }) {
  const navigate = useNavigate();
  const { guestTrialEnd } = useSession();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  const getDaysRemaining = () => {
    if (!guestTrialEnd) return 0;
    const diff = guestTrialEnd - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();

  useEffect(() => {
    if (daysLeft <= 0) onSignUp();
  }, [daysLeft, onSignUp]);

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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <User className="inline h-3 w-3 mr-1" />
              GUEST • 7-DAY TRIAL
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Clock className="inline h-3 w-3 mr-1" />
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* Trial Info */}
        <Card className="mb-6 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              Your Free Trial is Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li>• Unlimited face scans</li>
              <li>• Full hairstyle suggestions</li>
              <li>• Makeup & style analysis</li>
            </ul>

            <Alert className="bg-blue-50 border-blue-300">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.  
                Create an account to save your results.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card className="mb-6 bg-white/90 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Try FaceUp Tools</CardTitle>
            <CardDescription>
              Explore the full experience
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowDemo(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Camera className="h-5 w-5 mr-2" />
              Try Demo Scan
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/app/face-scan")}
              className="w-full"
            >
              Upload Photo Scan
            </Button>

            {showDemo && (
              <div className="space-y-6 mt-6">
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
                  userRole={USER_ROLES.GUEST}
                  hasAccess={hasAccess}
                />

                <div className="bg-purple-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Create Free Account</span>
                  </div>

                  <Button
                    onClick={() => navigate("/auth/signup")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate("/auth/signup")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Sign Up
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </Button>
        </div>

      </div>
    </div>
  );
}
