import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-purple-200">
        <Dialog.Title className="text-2xl font-bold text-center text-purple-700">
          {isSignup ? 'Create Your Account' : 'Welcome Back'}
        </Dialog.Title>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:scale-105 transition"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <hr className="flex-1 border-gray-300" />
          or continue with
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex justify-between gap-3">
          <button className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200">
            <FcGoogle size={20} /> Google
          </button>
          <button className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200">
            <FaFacebook size={20} className="text-blue-600" /> Facebook
          </button>
          <button className="flex-1 bg-gray-100 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-200">
            <FaApple size={20} className="text-black" /> Apple
          </button>
        </div>

        <p className="text-sm text-center text-gray-600">
          {isSignup ? 'Already have an account?' : 'New to FaceUp?'}{' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-purple-600 font-medium hover:underline">
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </Dialog>
  );
}
