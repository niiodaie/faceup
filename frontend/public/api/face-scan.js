// Mock API endpoint for face scanning
// This would be replaced with actual Face++ API integration in production

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulate processing delay
  setTimeout(() => {
    // Mock response based on the expected schema
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

    res.status(200).json(mockResponse);
  }, 2000);
}

