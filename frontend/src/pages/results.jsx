import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';

const ResultsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useSession();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/suggestions/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the results for this scan. It may have expired or been deleted.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Start New Scan
          </button>
        </div>
      </div>
    );
  }

  const { faceAnalysis, suggestions, generalAdvice, occasionLooks } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-4">Your Results ✨</h1>
          <p className="text-gray-600 text-lg">
            AI-powered beauty recommendations just for you
          </p>
        </div>

        {/* Face Analysis */}
        {faceAnalysis && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Face Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Face Shape</h3>
                <p className="text-gray-700 text-2xl">{faceAnalysis.faceShape || 'Oval'}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Skin Tone</h3>
                <p className="text-gray-700 text-2xl">{faceAnalysis.skinTone || 'Warm'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hairstyle Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Recommended Hairstyles</h2>
            <div className="space-y-6">
              {suggestions.map((style, index) => (
                <div key={index} className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{style.name}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {style.lengthCategory || 'Medium'}
                        </span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                          {style.maintenanceLevel || 'Low'} Maintenance
                        </span>
                      </div>
                    </div>
                    {style.confidence && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {Math.round(style.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Match</div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{style.description}</p>

                  {style.bestFor && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Best For:</h4>
                      <p className="text-gray-700">{style.bestFor}</p>
                    </div>
                  )}

                  {style.stylingTips && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">💡 Styling Tips:</h4>
                      <p className="text-gray-700">{style.stylingTips}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occasion Looks */}
        {occasionLooks && Object.keys(occasionLooks).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Occasion-Based Looks</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(occasionLooks).map(([occasion, look]) => (
                <div key={occasion} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold capitalize mb-3">
                    {occasion.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-gray-700">{look}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Advice */}
        {generalAdvice && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">✨ Personal Advice</h2>
            <p className="text-lg leading-relaxed">{generalAdvice}</p>
          </div>
        )}

        {/* Guest Upgrade Prompt */}
        {isGuest && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 mb-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want to Save Your Results?</h3>
            <p className="text-gray-700 mb-6">
              Create a free account to save your scan history and unlock more features!
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Sign Up Free
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/app')}
            className="px-8 py-3 bg-white text-gray-800 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            New Scan
          </button>
          {user && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
