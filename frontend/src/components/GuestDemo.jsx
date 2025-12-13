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
import { useSession } from "../hooks/useSession";

/**
 * GuestDemo — 7-day guest trial
 */
export default function GuestDemo({ onSignUp }) {
  const navigate = useNavigate();
  const { guestTrialEnd } = useSession();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  /* ===============================
     Trial countdown
     =============================== */
  const getDaysRemaining = () => {
    if (!guestTrialEnd) return 0;
    const diff = guestTrialEnd - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();

  useEffect(() => {
    if (daysLeft <= 0) {
      onSignUp();
    }
  }, [daysLeft, onSignUp]);

  /* ===============================
     Handlers
     =============================== */
  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
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

          <div className="mt-3 flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 flex items-center gap-1">
              <User className="h-3 w-3" />
              Guest Trial
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* Trial Info */}
        <Card className="mb-6 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              Your Free Trial Is Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Unlimited demo scans</li>
              <li>• Hairstyle & makeup previews</li>
              <li>• Mood-based suggestions</li>
            </ul>

            <Alert className="bg-blue-50 border-blue-300">
              <AlertDescription>
                Trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.  
                Create an account to save results.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card className="mb-6 bg-white/90 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-purple-800">
              Try FaceUp
            </CardTitle>
            <CardDescription>
              Explore the experience during your free trial
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
              <Camera className="h-5 w-5 mr-2" />
              Upload Photo
            </Button>

            {showDemo && (
              <div className="space-y-6 mt-6">
                <MoodSelector
                  selectedMoods={selectedMoods}
                  onMoodToggle={handleMoodToggle}
                  title="What’s today about?"
                />

                <CutMatchSuggestions
                  selectedMoods={selectedMoods}
                  entitlements={{ features: { basicSuggestions: true } }}
                />

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">
                      Save Your Results
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Create a free account to continue after your trial.
                  </p>

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

        {/* Bottom CTA */}
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
