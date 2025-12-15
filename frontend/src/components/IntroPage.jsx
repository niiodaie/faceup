import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Star } from 'lucide-react';
import { useSession } from '../hooks/useSession';

const IntroPage = () => {
  const navigate = useNavigate();
  const { enableGuestMode } = useSession();

  const handleContinue = () => {
    navigate('/auth/login');
  };

  const handleGuestDemo = () => {
    enableGuestMode();      // ✅ CRITICAL
    navigate('/app');       // ✅ Go to app shell
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* background & visuals unchanged */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        {/* ...content unchanged... */}

        <div className="space-y-3 pt-4">
          <Button
            onClick={handleContinue}
            className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-rose-400 text-white"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Continue to FaceUp
          </Button>

          <Button
            onClick={handleGuestDemo}
            variant="outline"
            className="w-full py-4 rounded-full font-bold border-2 border-pink-300 text-pink-600"
          >
            <Heart className="w-5 h-5 mr-2" />
            Try Guest Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
