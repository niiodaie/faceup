import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye } from 'lucide-react';

const Auth = ({ onGuestDemo }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  setLoading(false);
};

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) alert(error.message);
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setLoading(true);
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  setLoading(false);
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
            {isSignUp ? 'Sign Up' : 'Log In'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isSignUp ? 'Create your FaceUp account' : 'Welcome back to FaceUp'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
              required
            />
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
              required
            />
            <p className="text-sm text-right text-purple-600 hover:underline mt-2">
  <a href="/reset-password">Forgot your password?</a>
</p>
            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-3">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
              <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-purple-600 hover:text-purple-800">
                {isSignUp ? 'Log In' : 'Sign Up'}
              </Button>
            </p>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Button
  onClick={handleGoogleLogin}
  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
>
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.6 20.5h-1.9v-.1H24v7.1h11.3c-1.6 4.3-5.7 7.4-10.6 7.4-6.2 0-11.3-5-11.3-11.3s5-11.3 11.3-11.3c2.9 0 5.5 1.1 7.5 2.9l5.3-5.3C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.1l5.9 4.3c1.6-3 4.2-5.4 7.5-6.6L14 8.3C10.7 10.1 8.1 12.8 6.3 14.1z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.4 0 10.2-2 13.8-5.3l-6.4-5.2c-2 1.6-4.6 2.6-7.4 2.6-4.9 0-9-3.1-10.6-7.4l-6.3 4.9C10 39.7 16.6 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42v-.1H24v7.1h11.3c-.9 2.4-2.6 4.4-4.7 5.9l6.4 5.2C40.6 35.3 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z"
    />
  </svg>
  Continue with Google
</Button>

<Button
  onClick={onGuestDemo}
  variant="outline"
  className="w-full py-3 mt-2 rounded-lg font-bold text-lg border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
>
  <Eye className="h-5 w-5" />
  Try Guest Demo
</Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
