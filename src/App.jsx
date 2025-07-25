import React, { useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera } from 'lucide-react';

const FaceScanCard = ({ onFaceScan, isScanning }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isScanning && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
        });
    }
  }, [isScanning]);

  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-48 h-64 rounded-2xl bg-white/50 overflow-hidden flex items-center justify-center">
          {isScanning ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-pink-600" />
            </div>
          )}
        </div>

        <Button
          onClick={onFaceScan}
          disabled={isScanning}
          className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 font-semibold shadow-md border border-pink-200"
        >
          <Camera className="h-5 w-5 mr-2" />
          {isScanning ? 'Scanning...' : 'Face Scan'}
        </Button>
      </div>
    </Card>
  );
};

export default FaceScanCard;
