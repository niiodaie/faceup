import React from 'react';
import { Button } from './ui/button';
import { Globe, LogOut } from 'lucide-react';
import logoTagline from '../assets/faceup-logo-tagline.png';
import { supabase } from '../supabaseClient';

const Header = ({ onLanguageToggle, currentLanguage, session, user }) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  return (
    <header className="w-full px-4 py-6 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src={logoTagline} 
          alt="FaceUp - Be Seen. Be Styled. Be You." 
          className="h-12 w-auto"
        />
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600 hidden sm:inline-block">{user.email}</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLanguageToggle}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage}</span>
        </Button>
        {session && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

