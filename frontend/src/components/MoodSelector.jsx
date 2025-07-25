import React from 'react';
import { Button } from './ui/button';

const MoodSelector = ({ selectedMoods, onMoodToggle, title }) => {
  const moods = [
    'Brunch',
    'Interview', 
    'Breakup Glow-Up',
    'Vacation',
    'Boss Energy',
    'Wedding Guest'
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selectedMoods.includes(mood) ? "default" : "outline"}
            onClick={() => onMoodToggle(mood)}
            className={`
              rounded-full py-3 px-3 font-semibold text-sm
              transition-all duration-300 hover-lift
              ${selectedMoods.includes(mood) 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg border-2 border-white/20' 
                : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50'
              }
            `}
          >
            {mood}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;

