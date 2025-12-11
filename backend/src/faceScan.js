import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseService.js';
import { generateHairstyleSuggestions } from './openaiService.js';
import { runReplicateModel, getPredictionStatus } from './replicateService.js';

/**
 * Start a new face scan session
 * POST /face-scan or /ai/analyze
 */
export async function handleFaceScan(req, res) {
  try {
    const { userId, imageUrl, mood, style, gender } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Missing imageUrl',
        message: 'Please provide an image URL to analyze'
      });
    }

    // Generate session ID
    const sessionId = uuidv4();
    
    console.log(`Starting face scan session: ${sessionId}`);

    // Create session record
    const { error: insertError } = await supabase
      .from('face_scan_sessions')
      .insert({
        id: sessionId,
        user_id: userId || null,
        image_url: imageUrl,
        status: 'processing',
        progress: 0,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error creating session:', insertError);
      throw new Error('Failed to create scan session');
    }

    // Start async processing
    processFaceScan(sessionId, imageUrl, { mood, style, gender }).catch(err => {
      console.error(`Error processing session ${sessionId}:`, err);
      updateSessionStatus(sessionId, 'failed', err.message);
    });

    return res.json({
      sessionId,
      status: 'processing',
      message: 'Face scan started. Use /scan-status/:sessionId to check progress.'
    });

  } catch (error) {
    console.error('Error starting face scan:', error);
    return res.status(500).json({
      error: 'Failed to start face scan',
      message: error.message
    });
  }
}

/**
 * Process face scan asynchronously
 */
async function processFaceScan(sessionId, imageUrl, preferences) {
  try {
    // Update progress: analyzing image
    await updateSessionProgress(sessionId, 25, 'analyzing');

    // Step 1: Analyze face with Replicate (or fallback to OpenAI Vision)
    let faceAnalysis;
    try {
      faceAnalysis = await analyzeFaceWithReplicate(imageUrl);
    } catch (replicateError) {
      console.log('Replicate failed, using fallback analysis:', replicateError.message);
      faceAnalysis = getFallbackAnalysis();
    }

    // Update progress: generating suggestions
    await updateSessionProgress(sessionId, 50, 'analyzing');

    // Step 2: Generate hairstyle suggestions with OpenAI
    const suggestions = await generateHairstyleSuggestions(faceAnalysis, preferences);

    // Update progress: finalizing
    await updateSessionProgress(sessionId, 75, 'analyzing');

    // Step 3: Store results
    const { error: updateError } = await supabase
      .from('face_scan_sessions')
      .update({
        status: 'completed',
        progress: 100,
        face_analysis: faceAnalysis,
        suggestions: suggestions.hairstyles,
        occasion_looks: suggestions.occasionLooks,
        general_advice: suggestions.generalAdvice,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Face scan completed: ${sessionId}`);

  } catch (error) {
    console.error(`Error processing face scan ${sessionId}:`, error);
    await updateSessionStatus(sessionId, 'failed', error.message);
  }
}

/**
 * Analyze face using Replicate
 */
async function analyzeFaceWithReplicate(imageUrl) {
  // This is a placeholder - replace with actual Replicate model
  // For now, use a simple face detection model
  const MODEL_VERSION = "andreasjansson/face-detection:latest";
  
  const prediction = await runReplicateModel(MODEL_VERSION, {
    image: imageUrl
  });

  // Wait for completion
  let status = await getPredictionStatus(prediction.id);
  let attempts = 0;
  const maxAttempts = 30;

  while (status.status === 'processing' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    status = await getPredictionStatus(prediction.id);
    attempts++;
  }

  if (status.status !== 'succeeded' || !status.output) {
    throw new Error('Face analysis failed');
  }

  // Parse Replicate output
  return parseFaceAnalysis(status.output);
}

/**
 * Parse face analysis from Replicate output
 */
function parseFaceAnalysis(output) {
  return {
    faceShape: output.face_shape || 'oval',
    skinTone: output.skin_tone || 'medium',
    facialFeatures: {
      eyeShape: output.eye_shape || 'almond',
      faceLength: output.face_length || 'medium',
      jawline: output.jawline || 'rounded',
      cheekbones: output.cheekbones || 'medium'
    }
  };
}

/**
 * Fallback analysis when Replicate is unavailable
 */
function getFallbackAnalysis() {
  return {
    faceShape: 'oval',
    skinTone: 'medium',
    facialFeatures: {
      eyeShape: 'almond',
      faceLength: 'medium',
      jawline: 'defined',
      cheekbones: 'medium'
    }
  };
}

/**
 * Update session progress
 */
async function updateSessionProgress(sessionId, progress, status) {
  await supabase
    .from('face_scan_sessions')
    .update({
      progress,
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId);
}

/**
 * Update session status
 */
async function updateSessionStatus(sessionId, status, error = null) {
  await supabase
    .from('face_scan_sessions')
    .update({
      status,
      error,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId);
}

/**
 * Get scan status
 * GET /scan-status/:sessionId
 */
export async function getScanStatus(req, res) {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('face_scan_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'No scan session found with this ID'
      });
    }

    return res.json({
      sessionId: data.id,
      status: data.status,
      progress: data.progress || 0,
      faceAnalysis: data.face_analysis,
      suggestions: data.suggestions,
      occasionLooks: data.occasion_looks,
      generalAdvice: data.general_advice,
      error: data.error,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });

  } catch (error) {
    console.error('Error fetching scan status:', error);
    return res.status(500).json({
      error: 'Failed to fetch scan status',
      message: error.message
    });
  }
}

/**
 * Get suggestions for a completed scan
 * GET /suggestions/:sessionId
 */
export async function getSuggestions(req, res) {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('face_scan_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'No scan session found with this ID'
      });
    }

    if (data.status !== 'completed') {
      return res.status(400).json({
        error: 'Scan not completed',
        message: `Scan is currently ${data.status}. Please wait for completion.`,
        status: data.status,
        progress: data.progress
      });
    }

    return res.json({
      sessionId: data.id,
      faceAnalysis: data.face_analysis,
      suggestions: data.suggestions,
      occasionLooks: data.occasion_looks,
      generalAdvice: data.general_advice,
      createdAt: data.created_at
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
}
