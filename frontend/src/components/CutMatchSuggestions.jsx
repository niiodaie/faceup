import React from 'react';
import { Button } from './ui/button';

const CutMatchSuggestions = () => {
  const suggestions = [
    'Buzzcut Revival',
    'Taper Fade',
    'Soft Glam',
    'Bold Brow Energy',
    'Festival Queen',
    'Date Night Glow'
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
        Top Style Suggestions
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="
              bg-gradient-to-r from-purple-50 to-pink-50 
              border-2 border-purple-200 
              text-purple-700 font-semibold 
              rounded-full py-3 px-4 
              shadow-md hover:shadow-lg 
              hover:from-purple-100 hover:to-pink-100 
              hover:border-purple-300 
              transition-all duration-300 
              hover-lift
            "
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CutMatchSuggestions;

