import React, { useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

const FaceScanUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        face_shape: "round",
        skin_status: {
          acne: 0.3,
          dark_circle: 0.4,
          wrinkles: 0.2,
          skin_tone: "medium"
        },
        recommendations: [
          {
            name: "SKKN Eye Cream",
            link: "https://amzn.to/skkn",
            reason: "Recommended for dark circles",
            price: "$45",
            rating: 4.5
          },
          {
            name: "Gentle Acne Treatment",
            link: "https://amzn.to/acne-treatment",
            reason: "Helps reduce acne appearance",
            price: "$28",
            rating: 4.3
          },
          {
            name: "Hydrating Face Serum",
            link: "https://amzn.to/face-serum",
            reason: "Perfect for your skin tone",
            price: "$35",
            rating: 4.7
          }
        ],
        confidence: 0.85,
        analysis_time: "2.3s"
      };

      setResult(mockResponse);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Upload a selfie</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="rounded-lg w-full" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !image}
        className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            Scan Face
          </>
        )}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="font-bold mb-2">Results:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FaceScanUpload;

