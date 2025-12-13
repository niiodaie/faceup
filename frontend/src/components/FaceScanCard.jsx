import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 320,
  height: 480,
  facingMode: 'user',
};

const FaceScanCard = ({ onFaceScan, isScanning, onCapture, entitlements }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  /**
   * ACCESS ENFORCEMENT
   */
  if (!entitlements?.features?.faceScan) {
    return (
      <Card className="p-6 text-center rounded-3xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Face Scan Locked</h3>
        <p className="text-gray-600 mb-4">
          Upgrade to Pro to unlock face scanning.
        </p>
        <Button
          onClick={() => (window.location.href = '/pricing')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6"
        >
          Upgrade Now
        </Button>
      </Card>
    );
  }

  const handleFaceScan = () => {
    setShowCamera(true);
    onFaceScan?.();
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    onCapture?.(imageSrc);
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        <div className="w-48 h-64 bg-white/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
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

        {showCamera && (
          <Button
            onClick={captureImage}
            className="mb-2 bg-pink-500 text-white hover:bg-pink-600 rounded-full px-8 py-2"
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Capture
          </Button>
        )}

        <Button
          onClick={handleFaceScan}
          disabled={isScanning}
          className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
        >
          <Camera className="h-5 w-5 mr-2" />
          {isScanning ? 'Scanning…' : showCamera ? 'Rescan' : 'Face Scan'}
        </Button>
      </div>
    </Card>
  );
};

export default FaceScanCard;
