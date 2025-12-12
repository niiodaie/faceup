import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authHelpers } from "../../utils/supabaseClient";
import { useSession } from "../../hooks/useSession.jsx";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { enableGuestMode } = useSession();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState("email");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMessage("");
  };

  /* ------------------ LOGIN HANDLERS ------------------ */

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || !formData.password) {
      return setMessage("Enter valid credentials");
    }

    setLoading(true);
    try {
      const { error } = await authHelpers.signInWithEmail(
        formData.email,
        formData.password,
        rememberMe
      );
      if (error) return setMessage(error.message);
      navigate("/app");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      return setMessage("Enter a valid email");
    }

    setLoading(true);
    try {
      const { error } = await authHelpers.signInWithMagicLink(
        formData.email,
        rememberMe
      );
      if (error) return setMessage(error.message);
      setMagicLinkSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await authHelpers.signInWithGoogle(rememberMe);
      if (error) setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ TRIAL (GUEST) HANDLER ------------------ */

  const startTrial = () => {
    const TRIAL_DAYS = 7;
    const expiresAt = Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      "faceup_trial",
      JSON.stringify({
        active: true,
        expiresAt,
      })
    );

    enableGuestMode();
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-6 bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue your style journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="magic">Magic</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-6 space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic" className="mt-6 space-y-4">
              {magicLinkSent ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="mx-auto text-purple-600" />
                  <p>Check your email for the magic link</p>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <Input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Button className="w-full">Send Magic Link</Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          {message && (
            <Alert className="mt-4 border-red-500">
              <AlertCircle />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full mt-4"
          >
            Continue with Google
          </Button>

          {/* ⭐ TRIAL BUTTON */}
          <Button
            onClick={startTrial}
            variant="outline"
            className="w-full mt-4 border-purple-300 text-purple-600 font-bold"
          >
            <Sparkles className="mr-2" />
            Start 7-Day Free Trial
          </Button>

          <div className="mt-6 text-center">
            <p>
              Don’t have an account?{" "}
              <Link to="/auth/signup" className="text-purple-600 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
