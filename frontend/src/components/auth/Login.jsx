import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authHelpers } from '../../utils/supabaseClient';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[\d\s-()]+$/.test(phone);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await authHelpers.signInWithEmail(
        formData.email,
        formData.password,
        rememberMe
      );

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setMessage('Please check your email and click the verification link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid email or password. Please try again.');
        } else {
          setMessage(error.message);
        }
      } else {
        navigate('/app');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await authHelpers.signInWithGoogle(rememberMe);
      if (error) {
        setMessage(error.message);
      }
      // Note: For OAuth, the redirect happens automatically
    } catch (error) {
      setMessage('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await authHelpers.signInWithMagicLink(formData.email, rememberMe);
      
      if (error) {
        setMessage(error.message);
      } else {
        setMagicLinkSent(true);
        setMessage('Check your email for a magic link to sign in!');
      }
    } catch (error) {
      setMessage('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.phone) {
      setMessage('Please enter your phone number');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setMessage('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await authHelpers.signInWithPhone(formData.phone);
      
      if (error) {
        setMessage(error.message);
      } else {
        // Navigate to OTP verification page
        navigate('/auth/verify-phone', { state: { phone: formData.phone } });
      }
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 tracking-wide">
          Face<span className="italic font-light">Up</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
      </div>

      <Card className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to continue your style journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic" className="space-y-4 mt-6">
              {magicLinkSent ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Check Your Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We've sent a magic link to {formData.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => setMagicLinkSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Link
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="text-center mb-4">
                    <Sparkles className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      Enter your email and we'll send you a magic link to sign in
                    </p>
                  </div>
                  
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-magic"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <label htmlFor="remember-magic" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Magic Link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-6">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="text-center mb-4">
                  <Phone className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                  <p className="text-sm text-gray-600">
                    Enter your phone number to receive an OTP
                  </p>
                </div>
                
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {message && (
            <Alert className={`mt-4 ${magicLinkSent ? 'border-green-500' : 'border-red-500'}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200 font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

           {/* Guest Demo Button */}
<Button
  onClick={onGuestDemo}
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
      to="/signup"
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
