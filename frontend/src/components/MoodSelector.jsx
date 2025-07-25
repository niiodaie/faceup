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
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selectedMoods.includes(mood) ? "default" : "outline"}
            onClick={() => onMoodToggle(mood)}
            className={`
              rounded-full py-3 px-4 font-medium transition-all duration-200
              ${selectedMoods.includes(mood) 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-600'
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

