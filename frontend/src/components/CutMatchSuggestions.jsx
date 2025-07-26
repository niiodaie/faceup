import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Lock, Sparkles } from 'lucide-react';
import { generateSuggestions } from '../api/suggestions';

const CutMatchSuggestions = ({ userRole, hasAccess, selectedMoods = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMoods.length > 0) {
      fetchSuggestions();
    }
  }, [selectedMoods, userRole]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const primaryMood = selectedMoods[0] || 'brunch';
      const result = await generateSuggestions(primaryMood, 'oval', userRole);
      
      if (result.success) {
        setSuggestions(result.data.suggestions);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const getVisibleSuggestions = () => {
    if (hasAccess(userRole, 'unlimited_suggestions')) {
      return suggestions;
    } else if (hasAccess(userRole, 'limited_suggestions')) {
      return suggestions.slice(0, 4);
    } else {
      return suggestions.slice(0, 2); // Demo for guests
    }
  };

  const visibleSuggestions = getVisibleSuggestions();
  const hasMoreSuggestions = suggestions.length > visibleSuggestions.length;

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          CutMatch Suggestions
        </h2>
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-purple-600">
            <Sparkles className="h-5 w-5 animate-spin" />
            <span>Generating suggestions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          CutMatch Suggestions
        </h2>
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        CutMatch Suggestions
      </h2>
      
      {visibleSuggestions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {visibleSuggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-0 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-purple-700 font-medium text-sm">
                {suggestion}
              </span>
            </Card>
          ))}
          
          {hasMoreSuggestions && (
            <Card className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border-0 rounded-full shadow-sm opacity-60">
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-gray-500" />
                <span className="text-gray-500 font-medium text-sm">
                  +{suggestions.length - visibleSuggestions.length} more
                </span>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Select a mood to get personalized suggestions!</p>
        </div>
      )}
      
      {hasMoreSuggestions && (
        <p className="text-center text-sm text-gray-500 mt-3">
          {userRole === 'guest' ? 'Sign up to see more suggestions' : 'Upgrade to Pro for unlimited suggestions'}
        </p>
      )}
    </div>
  );
};

export default CutMatchSuggestions;

