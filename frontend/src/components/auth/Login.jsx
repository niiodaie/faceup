import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authHelpers } from '../../utils/supabaseClient';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useSession } from "../../hooks/useSession.jsx";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const Login = ({ onGuestDemo }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState('email');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });

  const [message, setMessage] = useState('');

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s-()]+$/.test(phone);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setMessage('Please fill in all fields');
    if (!validateEmail(formData.email)) return setMessage('Enter a valid email');

    setLoading(true);

    try {
      const { error } = await authHelpers.signInWithEmail(
        formData.email,
        formData.password,
        rememberMe
      );
      if (error) return setMessage(error.message);
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return setMessage('Enter a valid email');

    setLoading(true);

    try {
      const { error } = await authHelpers.signInWithMagicLink(formData.email, rememberMe);
      if (error) return setMessage(error.message);
      setMagicLinkSent(true);
      setMessage('Magic link sent! Check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) return setMessage('Enter a valid phone number');

    setLoading(true);
    try {
      const { error } = await authHelpers.signInWithPhone(formData.phone);
      if (error) return setMessage(error.message);
      navigate('/auth/verify-phone', { state: { phone: formData.phone } });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">

      {/* Logo + Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 tracking-wide">
          Face<span className="italic font-light">Up</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
      </div>

      {/* Card Wrapper */}
      <Card className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-md">

        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to continue your style journey
          </CardDescription>
        </CardHeader>

        <CardContent>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                  </div>

                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                    </>
                  ) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Magic Link */}
            <TabsContent value="magic" className="space-y-4 mt-6">
              {magicLinkSent ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-10 w-10 text-purple-600 mx-auto" />
                  <p>Magic link sent to {formData.email}</p>
                  <Button
                    variant="outline"
                    onClick={() => setMagicLinkSent(false)}
                    className="w-full"
                  >
                    Send Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-purple-500 text-white rounded-lg"
                  >
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Phone Login */}
            <TabsContent value="phone" className="space-y-4 mt-6">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-500 text-white rounded-lg"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Error Message */}
          {message && (
            <Alert className="mt-4 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Divider */}
          <div className="mt-6 relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 border-red-300 text-red-600"
          >
            Continue with Google
          </Button>

          {/* Guest Demo Button */}
<Button
  onClick={() => {
    enableGuestMode();              // activate guest
    localStorage.setItem("faceup_guest_mode", "true");
    window.location.href = "/app";  // force route (works on Vercel SPA)
  }}
  variant="outline"
  className="w-full py-3 rounded-lg font-bold text-lg border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
>
  <Sparkles className="h-5 w-5" />
  Try Guest Demo
</Button>

{/* Sign Up footer */}
<div className="mt-6 text-center">
  <p className="text-gray-600">
    Don't have an account?{' '}
    <Link
      to="/auth/signup"
      className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
    >
      Sign Up
    </Link>
  </p>
</div>


        </CardContent>
      </Card>

    </div>
  );
};

export default Login;
