import React from 'react';
import { Button } from './ui/button';
import { Globe, Mic } from 'lucide-react';
import logoTagline from '../assets/faceup-logo-tagline.png';

const Header = ({ onLanguageToggle, currentLanguage }) => {
  return (
    <header className="w-full px-4 py-6 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src={logoTagline} 
          alt="FaceUp - Be Seen. Be Styled. Be You." 
          className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {/* Voice trigger button (placeholder) */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full p-2"
        >
          <Mic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLanguageToggle}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-3 py-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-semibold">{currentLanguage}</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;

