import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera } from 'lucide-react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 320,
  height: 480,
  facingMode: 'user',
};

const FaceScanCard = ({ onFaceScan, isScanning }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleFaceScan = () => {
    setShowCamera(true);
    setCapturedImage(null); // reset any previous image
    if (onFaceScan) onFaceScan();
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        {/* Camera view / captured image / placeholder */}
        <div className="w-48 h-64 bg-white/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured face"
              className="rounded-xl w-full h-full object-cover"
            />
          ) : showCamera ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-xl"
            />
          ) : (
            <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-pink-600" />
            </div>
          )}
        </div>

        {/* Main scan button */}
        <Button
          onClick={handleFaceScan}
          disabled={isScanning}
          className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
        >
          <Camera className="h-5 w-5 mr-2" />
          {isScanning ? 'Scanning...' : showCamera ? 'Rescan' : 'Face Scan'}
        </Button>

        {/* Capture & Retake */}
        {showCamera && !capturedImage && (
          <Button
            onClick={capture}
            className="mt-4 bg-pink-600 text-white rounded-full px-6 py-2 shadow-md"
          >
            📸 Capture
          </Button>
        )}

        {capturedImage && (
          <Button
            onClick={() => setCapturedImage(null)}
            variant="ghost"
            className="mt-2 text-sm text-pink-600 underline hover:text-pink-800 bg-transparent"
          >
            Retake
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FaceScanCard;
