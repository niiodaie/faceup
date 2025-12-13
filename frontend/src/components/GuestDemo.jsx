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
    return Math.max(
      0,
      Math.ceil((guestTrialEnd - Date.now()) / (1000 * 60 * 60 * 24))
    );
  };

  const daysLeft = getDaysRemaining();

  useEffect(() => {
    if (daysLeft <= 0) onSignUp();
  }, [daysLeft, onSignUp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-3">FACEUP</h1>
          <p className="text-gray-600">Be Seen. Be Styled. Be You.</p>

          <div className="mt-3 flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              <User className="inline h-3 w-3 mr-1" />
              GUEST TRIAL
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              <Clock className="inline h-3 w-3 mr-1" />
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* TRIAL INFO */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Free Trial Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Trial ends in {daysLeft} day{daysLeft !== 1 && "s"}.
                Create an account to save your results.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle>Try FaceUp</CardTitle>
            <CardDescription>
              Explore during your free trial
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowDemo(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Try Demo Scan
            </Button>

            {showDemo && (
              <>
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
                  entitlements={{
                    plan: "guest",
                    features: { basicSuggestions: true },
                  }}
                />

                <div className="border rounded-xl p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold">
                      Save Your Results
                    </span>
                  </div>

                  <Button
                    onClick={() => navigate("/auth/signup")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* FOOTER */}
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
