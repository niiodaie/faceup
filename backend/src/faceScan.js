import { runReplicateModel, getPredictionStatus } from "./replicateService.js";
import { supabase } from "./supabaseService.js";

/**
 * =====================================================================
 *  1. START A FACE SCAN → POST /face-scan
 * =====================================================================
 */
export async function handleFaceScan(req, res) {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    // Start prediction
    const MODEL_VERSION =
      "andreasjansson/face-detection:6c5e5e9f0c1a8c3e8e9f0c1a8c3e8e9f0c1a8c3e";

    const prediction = await runReplicateModel(MODEL_VERSION, {
      image: imageUrl,
      return_attributes: true,
    });

    // Store session
    const { data, error } = await supabase
      .from("face_scan_sessions")
      .insert({
        session_id: prediction.id,
        image_url: imageUrl,
        status: "processing",
      })
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      sessionId: prediction.id,
      status: "processing",
    });
  } catch (error) {
    console.error("Error starting face scan:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * =====================================================================
 *  2. GET SCAN STATUS → GET /scan-status/:sessionId
 * =====================================================================
 */
export async function getScanStatus(req, res) {
  try {
    const { sessionId } = req.params;

    const prediction = await getPredictionStatus(sessionId);

    // Update DB
    await supabase
      .from("face_scan_sessions")
      .update({ status: prediction.status })
      .eq("session_id", sessionId);

    return res.json({
      sessionId,
      status: prediction.status,
      result: prediction.output || null,
    });
  } catch (error) {
    console.error("Error fetching scan status:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * =====================================================================
 *  3. GET SUGGESTIONS → GET /suggestions/:sessionId
 * =====================================================================
 */
export async function getSuggestions(req, res) {
  try {
    const { sessionId } = req.params;

    const prediction = await getPredictionStatus(sessionId);

    if (!prediction.output) {
      return res.status(404).json({
        error: "Scan not complete or no output available",
      });
    }

    const suggestions = generateFaceSuggestions(prediction.output);

    return res.json({
      sessionId,
      suggestions,
      raw: prediction.output,
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * =====================================================================
 *  4. SUGGESTIONS ENGINE
 * =====================================================================
 */
function generateFaceSuggestions(output) {
  // Simple logic (replace with your trained suggestions logic later)
  return {
    bestHaircuts: ["High Fade", "Waves", "Taper Fade", "Buzzcut"],
    beardStyles: ["Goatee", "Short Beard", "Clean Shave"],
    faceShape: output.face_shape || "oval",
    skinTone: output.skin_tone || "medium",
  };
}
