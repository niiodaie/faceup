import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, Repeat } from 'lucide-react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 320,
  height: 480,
  facingMode: 'user',
};

const FaceScanCard = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImageSrc(screenshot);
        if (onCapture) onCapture(screenshot);
      }
    }
  };

  const resetPhoto = () => {
    setImageSrc(null);
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        <div className="w-48 h-64 bg-white/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img src={imageSrc} alt="Captured" className="rounded-xl" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-xl"
            />
          )}
        </div>

        {imageSrc ? (
          <Button
            onClick={resetPhoto}
            className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
          >
            <Repeat className="h-5 w-5 mr-2" />
            Rescan
          </Button>
        ) : (
          <Button
            onClick={capturePhoto}
            className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
          >
            <Camera className="h-5 w-5 mr-2" />
            Capture
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FaceScanCard;
