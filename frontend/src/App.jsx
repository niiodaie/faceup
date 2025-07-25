import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FaceScanCard from './components/FaceScanCard';
import MoodSelector from './components/MoodSelector';
import CutMatchSuggestions from './components/CutMatchSuggestions';
import ActionButton from './components/ActionButton';

function App() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleFaceScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Here you would typically navigate to results or show results
    }, 3000);
  };

  const handleLanguageToggle = () => {
    const languages = ['EN', 'ES', 'FR', 'AR'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  const handleTryAR = () => {
    // Navigate to AR try-on view
    console.log('Navigate to AR try-on');
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-100 to-pink-200 py-10 px-4">
    <main className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">🎨 CutMatch</h1>
        <p className="text-gray-500 text-sm">Scan your face. Pick your mood. Get inspired.</p>
      </div>

      {isScanning && (
        <div className="flex flex-col items-center my-6">
          <span className="text-purple-600 font-semibold mb-2">🔍 Scanning your face...</span>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      )}

      {capturedImage && (
        <div className="mt-6 text-center">
          <h4 className="text-md font-medium mb-2 text-gray-600">📸 Captured Image</h4>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-40 h-40 object-cover rounded-xl border-4 border-purple-200 shadow-md mx-auto"
          />
        </div>
      )}

      {hairstyleSuggestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold text-purple-600 mb-4 text-center">
            🎯 Top Style Suggestions
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {hairstyleSuggestions.map((style, index) => (
              <li
                key={index}
                className="bg-white px-5 py-2 rounded-full text-sm text-gray-800 shadow-md hover:bg-purple-50 transition-all duration-200"
              >
                {style}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-10">
        <ActionButton
          onClick={handleTryAR}
          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition"
        >
          SWIPE, SAVE, TRY AR
        </ActionButton>
      </div>
    </main>
  </div>
);
