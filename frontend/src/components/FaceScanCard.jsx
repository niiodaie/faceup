import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, CheckCircle, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 320,
  height: 480,
  facingMode: 'user',
};

const FaceScanCard = ({ onFaceScan, isScanning, onCapture }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleFaceScan = () => {
    setShowCamera(true);
    if (onFaceScan) onFaceScan();
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    if (onCapture) {
      onCapture(imageSrc);
    }
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-0 shadow-2xl hover-lift">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        <div className="w-48 h-64 bg-white/70 rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-lg border border-white/50">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="rounded-xl w-full h-full object-cover" />
          ) : showCamera ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-xl"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-inner">
              <Camera className="h-12 w-12 text-purple-600" />
            </div>
          )}
        </div>

        {showCamera && (
          <Button 
            onClick={captureImage} 
            className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 rounded-full px-8 py-2 font-semibold shadow-lg hover-lift"
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Capture
          </Button>
        )}

        <Button
          onClick={handleFaceScan}
          disabled={isScanning}
          className={`
            bg-gradient-to-r from-pink-500 to-purple-500 text-white 
            hover:from-pink-600 hover:to-purple-600 
            rounded-full px-8 py-3 font-bold text-lg shadow-lg 
            transition-all duration-300 hover-lift
            ${isScanning ? 'pulse-glow' : ''}
          `}
        >
          {isScanning ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 spin-dots" />
              Scanning...
            </>
          ) : (
            <>
              <Camera className="h-5 w-5 mr-2" />
              {showCamera ? 'Rescan' : 'Face Scan'}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default FaceScanCard;
