import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FaceScanCard from './components/FaceScanCard';
import MoodSelector from './components/MoodSelector';
import CutMatchSuggestions from './components/CutMatchSuggestions';
import ActionButton from './components/ActionButton';
import AuthModal from './components/AuthModal';

function App() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [capturedImage, setCapturedImage] = useState(null); // 👈 New state
  const [isAuthOpen, setIsAuthOpen] = useState(false);


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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto">
        <Header 
          onLanguageToggle={handleLanguageToggle}
          currentLanguage={currentLanguage}
        />
        
        <main className="px-4 pb-8">
          <div className="main-card-wrapper p-6 mx-2 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold gradient-text mb-3">
                FACEUP
              </h1>
              <p className="text-gray-600 text-lg font-medium">Be Seen. Be Styled. Be You.</p>
            </div>
            
            <div className="space-y-8">
              <FaceScanCard 
                onFaceScan={handleFaceScan}
                onCapture={handleCaptureImage}
                isScanning={isScanning}
              />

              {/* Show captured image with Polaroid effect */}
              {capturedImage && (
                <div className="flex justify-center">
                  <div className="polaroid-frame">
                    <img 
                      src={capturedImage} 
                      alt="Captured face" 
                      className="w-32 h-40 object-cover rounded"
                    />
                  </div>
                </div>
              )}

              <MoodSelector 
                selectedMoods={selectedMoods}
                onMoodToggle={handleMoodToggle}
                title="What's today about?"
              />

              <CutMatchSuggestions />

              <ActionButton onClick={handleTryAR}>
                SWIPE, SAVE, TRY AR
              </ActionButton>

              <button
  onClick={() => setIsAuthOpen(true)}
  className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition z-50"
>
  Login / Sign Up
</button>


              
            </div>
          </div>
        </main>
      </div>
      
      {/* VNX Powered by Visnec Icon */}
      <a 
        href="https://visnec.ai" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-4 right-4 z-50 group"
        title="Powered by VNX"
      >
        <img 
          src="/vnx-icon.png" 
          alt="VNX" 
          className="w-8 h-8 opacity-50 hover:opacity-100 transition-all duration-300 group-hover:scale-110 drop-shadow-lg" 
        />
      </a>
    </div>
  );
}

export default App;
