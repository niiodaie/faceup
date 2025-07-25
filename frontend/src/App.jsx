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
  const [capturedImage, setCapturedImage] = useState(null);
  const [hairstyleSuggestions, setHairstyleSuggestions] = useState([]);

  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
  };

  const handleFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate setting an image and results
      setCapturedImage('https://via.placeholder.com/150');
      setHairstyleSuggestions(['Layered Bob', 'Braided Bun', 'Curly Pixie']);
    }, 3000);
  };

  const handleLanguageToggle = () => {
    const languages = ['EN', 'ES', 'FR', 'AR'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  const handleTryAR = () => {
    console.log('Navigate to AR try-on');
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 py-10 px-4">
    <main className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-2 tracking-tight">🎨 CutMatch</h1>
        <p className="text-gray-600 text-md">Scan your face. Pick your mood. Get inspired.</p>
      </div>

      {isScanning && (
        <div className="flex flex-col items-center my-10">
          <span className="text-purple-700 font-medium mb-3 text-lg">🔍 Scanning your face...</span>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid"></div>
        </div>
      )}

      {capturedImage && (
        <div className="mt-6 text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">📸 Your Captured Image</h4>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-44 h-44 object-cover rounded-2xl border-4 border-purple-300 shadow-xl mx-auto"
          />
        </div>
      )}

      {hairstyleSuggestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">
            🎯 Top Style Suggestions
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {hairstyleSuggestions.map((style, index) => (
              <li
                key={index}
                className="bg-purple-100 text-purple-800 px-5 py-2 rounded-full text-sm shadow hover:bg-purple-200 transition"
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
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-all"
        >
          SWIPE, SAVE, TRY AR
        </ActionButton>
      </div>
    </main>
  </div>
);

}

export default App;
