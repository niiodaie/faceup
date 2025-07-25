import React from 'react';
import { Card } from './ui/card';

const CutMatchSuggestions = () => {
  const suggestions = [
    '#SoftLife',
    '#DateNight', 
    '#FestivalQueen',
    '#BoldBrowEnergy'
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        CutMatch Suggestions
      </h2>
      
      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-0 rounded-full shadow-sm"
          >
            <span className="text-purple-700 font-medium text-sm">
              {suggestion}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CutMatchSuggestions;

