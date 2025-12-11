import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate hairstyle suggestions using OpenAI GPT
 */
export async function generateHairstyleSuggestions(faceAnalysis, userPreferences) {
  try {
    const { faceShape, skinTone, facialFeatures } = faceAnalysis;
    const { mood, style, gender } = userPreferences;

    const prompt = buildPrompt(faceShape, skinTone, facialFeatures, mood, style, gender);

    console.log('Requesting hairstyle suggestions from OpenAI...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert hairstylist and beauty consultant with deep knowledge of face shapes, skin tones, and current hairstyle trends. You provide personalized hairstyle recommendations based on facial features and personal preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const suggestions = JSON.parse(response);

    console.log('Hairstyle suggestions generated successfully');
    return formatSuggestions(suggestions);
  } catch (error) {
    console.error('Error generating hairstyle suggestions:', error);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
}

/**
 * Build prompt for GPT based on face analysis and preferences
 */
function buildPrompt(faceShape, skinTone, facialFeatures, mood, style, gender) {
  return `
Based on the following face analysis and preferences, provide 5 personalized hairstyle recommendations:

Face Analysis:
- Face Shape: ${faceShape}
- Skin Tone: ${skinTone}
- Eye Shape: ${facialFeatures.eyeShape}
- Face Length: ${facialFeatures.faceLength}
- Jawline: ${facialFeatures.jawline}
- Cheekbones: ${facialFeatures.cheekbones}

User Preferences:
- Mood/Vibe: ${mood || 'versatile'}
- Style Preference: ${style || 'modern'}
- Gender: ${gender || 'unspecified'}

Please provide recommendations in the following JSON format:
{
  "suggestions": [
    {
      "name": "Hairstyle Name",
      "description": "Detailed description of the hairstyle and why it suits this face shape",
      "lengthCategory": "short/medium/long",
      "maintenanceLevel": "low/medium/high",
      "bestFor": "Specific occasions or daily wear",
      "stylingTips": "How to style and maintain this look",
      "confidence": 0.95
    }
  ],
  "occasionLooks": {
    "dateNight": "Hairstyle and makeup recommendation for a romantic date",
    "office": "Professional look for work environment",
    "party": "Fun and bold look for parties and events",
    "wedding": "Elegant and sophisticated look for weddings"
  },
  "generalAdvice": "Overall styling tips for this face shape and features"
}

Focus on:
1. Hairstyles that complement the face shape
2. Styles that match the requested mood and vibe
3. Practical, achievable looks
4. Current trends that suit the individual
5. Diversity in length and style options
`;
}

/**
 * Format suggestions for frontend consumption
 */
function formatSuggestions(suggestions) {
  if (!suggestions.suggestions || !Array.isArray(suggestions.suggestions)) {
    throw new Error('Invalid suggestions format from OpenAI');
  }

  return {
    hairstyles: suggestions.suggestions.map((suggestion, index) => ({
      id: `style_${index + 1}`,
      name: suggestion.name,
      description: suggestion.description,
      lengthCategory: suggestion.lengthCategory,
      maintenanceLevel: suggestion.maintenanceLevel,
      bestFor: suggestion.bestFor,
      stylingTips: suggestion.stylingTips,
      confidence: suggestion.confidence || 0.85,
      imageUrl: null // Will be populated by Replicate if available
    })),
    occasionLooks: suggestions.occasionLooks || {},
    generalAdvice: suggestions.generalAdvice,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate product recommendations based on hairstyle
 */
export async function generateProductRecommendations(hairstyle, hairType) {
  try {
    const prompt = `
Recommend 4-5 hair care and styling products for someone with:
- Hairstyle: ${hairstyle}
- Hair Type: ${hairType || 'normal'}

Provide recommendations in JSON format:
{
  "products": [
    {
      "name": "Product Name",
      "category": "shampoo/conditioner/styling/treatment",
      "reason": "Why this product is recommended",
      "priceRange": "budget/mid/premium",
      "amazonSearchQuery": "search term for Amazon"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional hair care consultant who recommends products based on hairstyles and hair types."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response.products;
  } catch (error) {
    console.error('Error generating product recommendations:', error);
    return [];
  }
}

/**
 * Analyze uploaded image and provide quick feedback
 */
export async function analyzeImageQuality(imageDescription) {
  try {
    const prompt = `
Analyze this image description for a face scan application:
"${imageDescription}"

Provide feedback in JSON format:
{
  "isGoodQuality": true/false,
  "issues": ["list of any issues"],
  "suggestions": ["how to improve the photo"],
  "canProceed": true/false
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an image quality analyst for face scanning applications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing image quality:', error);
    return {
      isGoodQuality: true,
      canProceed: true,
      issues: [],
      suggestions: []
    };
  }
}
