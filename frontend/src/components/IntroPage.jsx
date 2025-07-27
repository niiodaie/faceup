import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Star } from 'lucide-react';

const IntroPage = ({ onGuestDemo }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50"></div>
      
      {/* Floating elements for ambiance - responsive positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-4 sm:top-20 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-8 sm:top-40 sm:right-16 w-2 h-2 sm:w-3 sm:h-3 bg-purple-200 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-24 left-8 sm:bottom-32 sm:left-20 w-4 h-4 sm:w-5 sm:h-5 bg-rose-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-48 left-1/4 sm:top-60 sm:left-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute bottom-32 right-4 sm:bottom-40 sm:right-10 w-2 h-2 sm:w-3 sm:h-3 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
        <div className="max-w-xs sm:max-w-sm mx-auto space-y-6 sm:space-y-8">
          
          {/* Logo and tagline */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 animate-pulse" />
              <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-500 to-rose-400 bg-clip-text text-transparent leading-tight">
                FACEUP
              </h1>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
              <p className="text-base sm:text-lg font-light tracking-wide">
                Unlock Your Inner Radiance
              </p>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
            </div>
            
            <p className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed px-2">
              Be Seen. Be Styled. Be You.
            </p>
          </div>

          {/* Feminine illustration - responsive sizing */}
          <div className="relative">
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto relative">
              {/* Soft glow effect behind illustration */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-2xl sm:blur-3xl opacity-30"></div>
              
              <img 
                src="/feminine-illustration.png" 
                alt="Beautiful woman in serene self-care moment" 
                className="w-full h-full object-cover rounded-full relative z-10 shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white/50"
              />
              
              {/* Floating stars around illustration - responsive positioning */}
              <Star className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
              <Star className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 text-pink-300 animate-bounce" />
              <Star className="absolute top-1/4 -left-2 sm:-left-4 w-2 h-2 sm:w-3 sm:h-3 text-purple-300 animate-pulse" />
              <Star className="absolute bottom-1/4 -right-2 sm:-right-4 w-4 h-4 sm:w-5 sm:h-5 text-rose-300 animate-bounce" />
            </div>
          </div>

          {/* Feature highlights - responsive text */}
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 px-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full"></div>
              <span>AI-Powered Style Recommendations</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
              <span>Personalized Beauty Insights</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full"></div>
              <span>Discover Your Perfect Look</span>
            </div>
          </div>

          {/* Action buttons - responsive sizing */}
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 px-2">
            <Button
              onClick={handleContinue}
              className="w-full py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg bg-gradient-to-r from-pink-400 via-purple-500 to-rose-400 text-white hover:from-pink-500 hover:via-purple-600 hover:to-rose-500 transition-all duration-500 shadow-lg sm:shadow-xl transform hover:scale-105 hover:shadow-2xl border-0"
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Continue to FaceUp</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </Button>
            
            <Button
              onClick={onGuestDemo}
              variant="outline"
              className="w-full py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 shadow-md sm:shadow-lg transform hover:scale-105 bg-white/80 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Try Guest Demo</span>
              </div>
            </Button>
          </div>

          {/* Subtle footer text */}
          <div className="pt-4 sm:pt-6">
            <p className="text-xs text-gray-500 font-light">
              Join thousands discovering their perfect style
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </div>
  );
};

export default IntroPage;

