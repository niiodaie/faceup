import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera } from 'lucide-react';

const FaceScanCard = ({ onFaceScan, isScanning }) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-pink-100 to-pink-50 border-0 shadow-lg">
      <div className="aspect-[3/4] flex flex-col items-center justify-center p-8">
        {/* Placeholder for face image or camera view */}
        <div className="w-48 h-64 bg-white/50 rounded-2xl mb-6 flex items-center justify-center">
          <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
            <Camera className="h-12 w-12 text-pink-600" />
          </div>
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

const Home = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFaceScan = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = document.getElementById('face-video');
      if (video) {
        video.srcObject = stream;
        video.play();
      } else {
        console.warn('Video element not found.');
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <FaceScanCard onFaceScan={handleFaceScan} isScanning={isScanning} />

      <video
        id="face-video"
        autoPlay
        playsInline
        className="mt-6 rounded-xl border border-pink-300 shadow-lg w-64 h-64 bg-black"
      />
    </div>
  );
};

export default Home;
