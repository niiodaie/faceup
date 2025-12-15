import React, { useState } from "react";
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

export default function GuestDemo() {
  const navigate = useNavigate();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  // Static guest messaging (NO session dependency)
  const daysLeft = 3;

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
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* Trial Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Free Trial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                You’re exploring FaceUp as a guest.  
                Sign up anytime to save your looks.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Try FaceUp</CardTitle>
            <CardDescription>
              Explore styles without an account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowDemo(true)}
              className="w-full"
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
