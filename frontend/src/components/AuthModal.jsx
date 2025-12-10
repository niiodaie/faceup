import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (data?.session) {
      alert('Login successful!');
      onClose(); // Close modal on success
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email first.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert('Password reset email sent.');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Background overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Modal content */}
        <div className="relative z-50 bg-white rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-purple-200">
          <Dialog.Title className="text-2xl font-bold text-center text-purple-700">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoFocus
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {!isSignup && (
              <p className="text-sm text-right">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="text-purple-500 hover:underline"
                >
                  Forgot password?
                </button>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <hr className="flex-1 border-gray-300" />
            or continue with
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* OAuth buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <FcGoogle size={20} /> Google
            </button>
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'facebook' })}
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <FaFacebook size={20} className="text-blue-600" /> Facebook
            </button>
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'apple' })}
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <FaApple size={20} className="text-black" /> Apple
            </button>
          </div>

          {/* Toggle signup/signin */}
          <p className="text-sm text-center text-gray-600">
            {isSignup ? 'Already have an account?' : 'New to FaceUp?'}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
              className="text-purple-600 font-medium hover:underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </Dialog>
  );
}
