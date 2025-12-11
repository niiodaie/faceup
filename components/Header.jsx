import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import AuthModal from './AuthModal'; // ✅ Ensure path is correct
import { Button } from './ui/button';

const Header = ({ onLanguageToggle, currentLanguage, session, user }) => {
  const [authOpen, setAuthOpen] = useState(false); // modal toggle

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      window.location.reload(); // force logout refresh or redirect if needed
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow-md bg-white/80 backdrop-blur-sm z-50">
      <h1 className="text-xl font-bold tracking-wide text-purple-700">FACEUP</h1>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onLanguageToggle}
        >
          {currentLanguage === 'en' ? 'FR' : 'EN'}
        </Button>

        {session ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user?.email || 'User'}</span>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
              Log Out
            </Button>
          </>
        ) : (
          <Button onClick={() => setAuthOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            Sign In
          </Button>
        )}
      </div>

      {/* 🔐 Auth Modal */}
      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}
    </header>
  );
};

export default Header;
