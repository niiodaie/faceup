import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';

const ScanPage = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useSession();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Upload image
      const formData = new FormData();
      formData.append('image', image);

      const uploadResponse = await fetch(`${API_URL}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await uploadResponse.json();
      setUploading(false);
      setScanning(true);

      // Step 2: Start face scan
      const scanResponse = await fetch(`${API_URL}/face-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || null,
          imageUrl,
          mood: 'versatile',
          style: 'modern'
        })
      });

      if (!scanResponse.ok) {
        throw new Error('Failed to start scan');
      }

      const { sessionId: newSessionId } = await scanResponse.json();
      setSessionId(newSessionId);

      // Step 3: Poll for results
      pollScanStatus(newSessionId);

    } catch (error) {
      console.error('Scan error:', error);
      alert('Failed to scan image. Please try again.');
      setUploading(false);
      setScanning(false);
    }
  };

  const pollScanStatus = async (sid) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${API_URL}/scan-status/${sid}`);
        if (!response.ok) {
          throw new Error('Failed to get scan status');
        }

        const data = await response.json();

        if (data.status === 'completed') {
          setScanning(false);
          navigate(`/results/${sid}`);
          return;
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Scan failed');
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          throw new Error('Scan timeout');
        }
      } catch (error) {
        console.error('Poll error:', error);
        setScanning(false);
        alert('Scan failed. Please try again.');
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-4">Face Scan</h1>
          <p className="text-gray-600 text-lg">
            Upload your photo and let AI analyze your perfect style
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!imagePreview ? (
            // Upload Section
            <div className="text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-purple-300 rounded-2xl p-12 cursor-pointer hover:border-purple-500 transition-all duration-300 hover:bg-purple-50"
              >
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
                <p className="text-gray-600 mb-4">
                  Click to select or drag and drop your image here
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            // Preview and Scan Section
            <div>
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>

              {!scanning && !uploading && (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Choose Different Photo
                  </button>
                  <button
                    onClick={handleScan}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Start AI Analysis
                  </button>
                </div>
              )}

              {(uploading || scanning) && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {uploading ? 'Uploading image...' : 'Analyzing your face...'}
                  </p>
                  <p className="text-gray-600">
                    {scanning && 'This may take up to 30 seconds'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-lg mb-4">📝 Tips for Best Results</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Use a clear, well-lit photo of your face</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Face the camera directly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Remove sunglasses or hats if possible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Ensure your entire face is visible</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/app')}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Back to App
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
