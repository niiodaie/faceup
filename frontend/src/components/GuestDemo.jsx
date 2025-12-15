import React, { useEffect, useState } from "react";
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
import { Camera, Sparkles, User, Clock, Star } from "lucide-react";
import MoodSelector from "./MoodSelector";
import CutMatchSuggestions from "./CutMatchSuggestions";
import { USER_ROLES, hasAccess } from "../hooks/useUserRole";
import { useSession } from "../hooks/useSession";

/**
 * GuestDemo
 * ----------
 * Explicit guest-only experience.
 * No auth required.
 * No redirects unless trial expires.
 */
export default function GuestDemo({ onSignUp = () => {} }) {
  const navigate = useNavigate();
  const { guestTrialEnd, setGuestSession } = useSession();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  /**
   * IMPORTANT
   * ----------
   * Explicitly mark this route as a guest session.
   * This prevents AppShell / route guards from spinning forever.
   */
  useEffect(() => {
    setGuestSession(true);
  }, [setGuestSession]);

  /**
   * Trial countdown (defensive)
   */
  const daysLeft = guestTrialEnd
    ? Math.max(
        0,
        Math.ceil((guestTrialEnd - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  /**
   * Trial expiration → upgrade flow
   */
  useEffect(() => {
    if (daysLeft <= 0 && typeof onSignUp === "function") {
      onSignUp();
    }
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

          <div className="mt-3 flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              <User className="inline h-3 w-3 mr-1" />
              GUEST
            </span>

            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              <Clock className="inline h-3 w-3 mr-1" />
              {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
            </span>
          </div>
        </div>

        {/* Trial Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Free Trial Active
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Alert>
              <AlertDescription>
                Enjoy limited access during your free trial.  
                Sign up to save looks and unlock full features.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Try FaceUp</CardTitle>
            <CardDescription>
              Explore styles during your free trial
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => setShowDemo(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Try Demo Scan
            </Button>

            {showDemo && (
              <>
                <MoodSelector
                  selectedMoods={selectedMoods}
                  onMoodToggle={(mood) =>
                    setSelectedMoods((prev) =>
                      prev.includes(mood)
                        ? prev.filter((x) => x !== mood)
                        : [...prev, mood]
                    )
                  }
                />

                <CutMatchSuggestions
                  userRole={USER_ROLES.GUEST}
                  hasAccess={hasAccess}
                />

                <Button
                  className="w-full mt-4"
                  onClick={() => navigate("/auth/signup")}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Sign Up Free
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
