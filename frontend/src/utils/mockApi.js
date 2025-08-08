// Mock API utility for face-scan functionality
// This simulates the backend API response for development purposes

export const mockFaceScanAPI = async (formData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock response based on the expected schema
  const mockResponse = {
    face_shape: "round",
    skin_status: {
      acne: Math.random() * 0.5, // Random value between 0-0.5
      dark_circle: Math.random() * 0.6, // Random value between 0-0.6
      wrinkles: Math.random() * 0.4, // Random value between 0-0.4
      skin_tone: ["light", "medium", "dark"][Math.floor(Math.random() * 3)]
    },
    recommendations: [
      {
        name: "SKKN Eye Cream",
        link: "https://amzn.to/skkn",
        reason: "Recommended for dark circles"
      },
      {
        name: "CeraVe Foaming Cleanser",
        link: "https://amzn.to/cerave",
        reason: "Gentle cleanser for acne-prone skin"
      },
      {
        name: "The Ordinary Retinol 0.2%",
        link: "https://amzn.to/ordinary",
        reason: "Helps reduce fine lines and improve skin texture"
      },
      {
        name: "Neutrogena Hydrating Moisturizer",
        link: "https://amzn.to/neutrogena",
        reason: "Provides deep hydration for healthy skin"
      }
    ],
    confidence: 0.85 + Math.random() * 0.1, // Random confidence between 0.85-0.95
    analysis_time: (1.5 + Math.random() * 2).toFixed(1) + "s" // Random time between 1.5-3.5s
  };

  return mockResponse;
};

