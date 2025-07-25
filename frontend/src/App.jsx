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
  const [capturedImage, setCapturedImage] = useState(null); // 👈 New state

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleCaptureImage = (imageBase64) => {
    setCapturedImage(imageBase64);
    console.log("Image captured:", imageBase64);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="max-w-md mx-auto">
        <Header 
          onLanguageToggle={handleLanguageToggle}
          currentLanguage={currentLanguage}
        />
        
        <main className="px-4 pb-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
              FACEUP
            </h1>
            <p className="text-gray-600 mb-8">Be Seen. Be Styled. Be You.</p>
            
            <FaceScanCard 
              onFaceScan={handleFaceScan}
              onCapture={handleCaptureImage} // 👈 Passed to child
              isScanning={isScanning}
            />

            {/* Show captured image */}
            {capturedImage && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Captured:</p>
                <img 
                  src={capturedImage} 
                  alt="Captured face" 
                  className="rounded shadow-md mx-auto w-32 h-auto"
                />
              </div>
            )}
          </div>

          <MoodSelector 
            selectedMoods={selectedMoods}
            onMoodToggle={handleMoodToggle}
            title="What's today about?"
          />

          <CutMatchSuggestions />

          <ActionButton onClick={handleTryAR}>
            SWIPE, SAVE, TRY AR
          </ActionButton>
        </main>
      </div>
    </div>
  );
}

export default App;
