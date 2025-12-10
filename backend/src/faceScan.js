import dotenv from "dotenv";
import { runReplicateModel, getPredictionStatus } from "./replicateService.js";

dotenv.config();

/**
 * 1. ANALYZE FACE
 * Using Replicate Face Detection / Attribute Model (REST API)
 */
export async function analyzeFace(imageUrl) {
  try {
    console.log("Starting face analysis with Replicate REST API…");

    // MODEL: Replace with the actual model version you want to use
    const MODEL_VERSION =
      "andreasjansson/face-detection:6c5e5e9f0c1a8c3e8e9f0c1a8c3e8e9f0c1a8c3e";

    // 1) Start prediction
    const prediction = await runReplicateModel(MODEL_VERSION, {
      image: imageUrl,
      return_attributes: true,
    });

    // 2) Poll until complete
    const output = await getPredictionStatus(prediction.id);

    console.log("Face analysis completed.");

    return parseFaceAnalysis(output.output);
  } catch (error) {
    console.error("Error analyzing face:", error);
    throw new Error(`Face analysis failed: ${error.message}`);
  }
}

/**
 * 2. PARSE FACE ATTRIBUTES
 */
function parseFaceAnalysis(output) {
  if (!output) return { error: "No analysis returned" };

  // Adjust based on actual Replicate model output
  const analysis = {
    faceShape: detectFaceShape(output),
    skinTone: detectSkinTone(output),
    facialFeatures: {
      eyeShape: output.eye_shape || "almond",
      jawline: output.jawline || "soft",
      cheekbones: output.cheekbones || "medium",
    },
    skinAnalysis: {
      texture: output.skin_texture || "smooth",
      clarity: output.skin_clarity || 0.8,
    },
    confidence: output.confidence || 0.9,
    rawOutput: output,
  };

  return analysis;
}

function detectFaceShape(output) {
  return output.face_shape || "oval";
}

function detectSkinTone(output) {
  return output.skin_tone || "medium";
}

/**
 * 3. GENERATE HAIRSTYLE VISUALIZATION
 * Uses Stable Diffusion / Img2Img REST.
 */
export async function generateHairstyleVisualization(
  imageUrl,
  hairstyleDescription
) {
  try {
    console.log("Generating hairstyle visualization…");

    const MODEL_VERSION =
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";

    const prediction = await runReplicateModel(MODEL_VERSION, {
      image: imageUrl,
      prompt: `Professional hairstyle: ${hairstyleDescription}, beauty portrait, high definition`,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 55,
    });

    const result = await getPredictionStatus(prediction.id);

    if (result.output && result.output.length > 0) {
      return result.output[0];
    }

    return null;
  } catch (error) {
    console.error("Error generating hairstyle visualization:", error);
    return null;
  }
}

/**
 * 4. SIMPLE FACE DETECTION (fallback)
 */
export async function detectFaceFeatures(imageUrl) {
  try {
    const MODEL_VERSION = "andreasjansson/face-detection:latest";

    const prediction = await runReplicateModel(MODEL_VERSION, {
      image: imageUrl,
    });

    const result = await getPredictionStatus(prediction.id);

    return {
      facesDetected: result.output?.length || 0,
      boundingBoxes: result.output || [],
      success: true,
    };
  } catch (error) {
    console.error("Error detecting face features:", error);
    return { facesDetected: 0, success: false, error: error.message };
  }
}
