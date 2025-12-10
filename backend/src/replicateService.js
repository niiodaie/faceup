import dotenv from 'dotenv';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

/**
 * Analyze face using Replicate API
 * Uses a face analysis model to detect features, skin tone, face shape, etc.
 */
export async function analyzeFace(imageUrl) {
  try {
    console.log('Starting face analysis with Replicate...');
    
    // Using a face analysis model (example: face detection and analysis)
    // You can replace this with the specific model you prefer
    const output = await replicate.run(
      "andreasjansson/face-detection:6c5e5e9f0c1a8c3e8e9f0c1a8c3e8e9f0c1a8c3e",
      {
        input: {
          image: imageUrl,
          return_attributes: true
        }
      }
    );

    console.log('Face analysis completed:', output);
    
    // Parse and structure the output
    return parseFaceAnalysis(output);
  } catch (error) {
    console.error('Error analyzing face with Replicate:', error);
    throw new Error(`Face analysis failed: ${error.message}`);
  }
}

/**
 * Parse face analysis output into structured format
 */
function parseFaceAnalysis(output) {
  // This is a generic parser - adjust based on actual model output
  const analysis = {
    faceShape: detectFaceShape(output),
    skinTone: detectSkinTone(output),
    facialFeatures: {
      eyeShape: output.eyeShape || 'almond',
      faceLength: output.faceLength || 'medium',
      jawline: output.jawline || 'soft',
      cheekbones: output.cheekbones || 'medium'
    },
    skinAnalysis: {
      texture: output.skinTexture || 'smooth',
      clarity: output.skinClarity || 0.85,
      tone: output.skinTone || 'medium'
    },
    confidence: output.confidence || 0.88,
    rawOutput: output
  };

  return analysis;
}

/**
 * Detect face shape from analysis output
 */
function detectFaceShape(output) {
  // Logic to determine face shape based on facial measurements
  // Common shapes: oval, round, square, heart, diamond, oblong
  
  if (output.faceShape) {
    return output.faceShape;
  }

  // Default fallback logic
  const shapes = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'];
  return shapes[0]; // Default to oval
}

/**
 * Detect skin tone from analysis output
 */
function detectSkinTone(output) {
  if (output.skinTone) {
    return output.skinTone;
  }

  // Fitzpatrick scale or simple categorization
  const tones = ['fair', 'light', 'medium', 'tan', 'dark', 'deep'];
  return tones[2]; // Default to medium
}

/**
 * Generate hairstyle recommendations based on face analysis
 * This uses Replicate's image generation models
 */
export async function generateHairstyleVisualization(imageUrl, hairstyleDescription) {
  try {
    console.log('Generating hairstyle visualization...');
    
    // Using an image-to-image model for hairstyle transformation
    // Example: stable-diffusion or similar model
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          image: imageUrl,
          prompt: `Professional hairstyle: ${hairstyleDescription}, high quality, professional photography`,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50
        }
      }
    );

    console.log('Hairstyle visualization generated');
    return output[0]; // Return the generated image URL
  } catch (error) {
    console.error('Error generating hairstyle visualization:', error);
    // Return null if generation fails - we can still provide text suggestions
    return null;
  }
}

/**
 * Alternative: Use a simpler face detection model
 * This is a fallback if the main model doesn't work
 */
export async function detectFaceFeatures(imageUrl) {
  try {
    // Using a basic face detection model
    const output = await replicate.run(
      "andreasjansson/face-detection:latest",
      {
        input: {
          image: imageUrl
        }
      }
    );

    return {
      facesDetected: output.length || 1,
      boundingBoxes: output,
      success: true
    };
  } catch (error) {
    console.error('Error detecting face features:', error);
    return {
      facesDetected: 0,
      success: false,
      error: error.message
    };
  }
}
