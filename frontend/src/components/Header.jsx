import React from 'react';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import logoTagline from '../assets/faceup-logo-tagline.png';

const Header = ({ onLanguageToggle, currentLanguage }) => {
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
        <Button
          variant="ghost"
          size="sm"
          onClick={onLanguageToggle}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage}</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;

