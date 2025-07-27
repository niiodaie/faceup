// src/pages/IntroPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust if path differs
import { Eye } from 'lucide-react';

const IntroPage = ({ onGuestDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700 mb-4">
        Welcome to FaceUp
      </h1>

      <p className="text-xl md:text-2xl text-gray-700 mb-10">
        Be Seen. Be Styled. Be You.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 text-lg font-semibold rounded-lg shadow-md hover:scale-105 transition-all"
        >
          Continue to FaceUp
        </Button>

        <Button
          onClick={onGuestDemo}
          variant="outline"
          className="flex items-center justify-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 py-3 text-lg font-bold rounded-lg"
        >
          <Eye className="h-5 w-5" />
          Try Guest Demo
        </Button>
      </div>
    </div>
  );
};

export default IntroPage;
