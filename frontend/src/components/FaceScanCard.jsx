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

  const handleFaceScan = () => {
    setShowCamera(true);
    if (onFaceScan) onFaceScan();
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        {/* Camera view or placeholder */}
        <div className="w-48 h-64 bg-white/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          <Webcam
  audio={false}
  ref={webcamRef}
  screenshotFormat="image/jpeg"
  videoConstraints={videoConstraints}
  className="rounded-xl border border-red-500"
  onUserMediaError={(err) => {
    console.error("Webcam error:", err);
    alert("Camera access denied or not available.");
  }}
/>


        <Button
          onClick={handleFaceScan}
          disabled={isScanning}
          className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
        >
          <Camera className="h-5 w-5 mr-2" />
          {isScanning ? 'Scanning...' : showCamera ? 'Rescan' : 'Face Scan'}
        </Button>
      </div>
    </Card>
  );
};

export default FaceScanCard;
