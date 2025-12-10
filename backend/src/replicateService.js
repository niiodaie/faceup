import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

if (!REPLICATE_API_KEY) {
  console.error("❌ Missing REPLICATE_API_KEY");
}

/**
 * Start a Replicate Prediction (REST API)
 */
export async function runReplicateModel(modelVersion, input) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${REPLICATE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: modelVersion,
      input
    })
  });

  const result = await response.json();

  if (result.error) {
    console.error("Replicate Error:", result.error);
    throw new Error(result.error);
  }

  return result; // contains id + status
}

/**
 * Poll prediction status until it's finished
 */
export async function getPredictionStatus(predictionId) {
  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${predictionId}`,
    {
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`
      }
    }
  );

  return await response.json();
}
