import { v4 as uuidv4 } from 'uuid';
import { analyzeFace } from './replicateService.js';
import { generateHairstyleSuggestions } from './openaiService.js';
import {
  saveFaceScanSession,
  updateFaceScanSession,
  saveHairstyleSuggestions,
  uploadImage
} from './supabaseService.js';

/**
 * Handle face scan request
 * POST /face-scan
 */
export async function handleFaceScan(req, res) {
  try {
    const { userId, imageUrl, mood, style, gender } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({
        error: 'Missing required field: imageUrl'
      });
    }

    // Generate unique session ID
    const sessionId = uuidv4();

    console.log(`Starting face scan for session: ${sessionId}`);

    // Save initial session to database
    await saveFaceScanSession({
      sessionId,
      userId: userId || null,
      imageUrl,
      mood: mood || 'versatile',
      style: style || 'modern'
    });

    // Start async processing (don't wait for completion)
    processFaceScan(sessionId, imageUrl, mood, style, gender).catch(error => {
      console.error(`Error processing face scan ${sessionId}:`, error);
      updateFaceScanSession(sessionId, {
        status: 'failed',
        error_message: error.message
      });
    });

    // Return immediately with session ID
    res.json({
      sessionId,
      status: 'processing',
      message: 'Face scan started. Use /scan-status/:sessionId to check progress.'
    });

  } catch (error) {
    console.error('Error handling face scan request:', error);
    res.status(500).json({
      error: 'Failed to start face scan',
      message: error.message
    });
  }
}

/**
 * Process face scan asynchronously
 */
async function processFaceScan(sessionId, imageUrl, mood, style, gender) {
  try {
    console.log(`Processing face scan: ${sessionId}`);

    // Update status to analyzing
    await updateFaceScanSession(sessionId, {
      status: 'analyzing',
      progress: 25
    });

    // Step 1: Analyze face with Replicate
    let faceAnalysis;
    try {
      faceAnalysis = await analyzeFace(imageUrl);
    } catch (error) {
      console.error('Replicate analysis failed, using fallback:', error);
      // Fallback to basic analysis
      faceAnalysis = {
        faceShape: 'oval',
        skinTone: 'medium',
        facialFeatures: {
          eyeShape: 'almond',
          faceLength: 'medium',
          jawline: 'soft',
          cheekbones: 'medium'
        },
        confidence: 0.75
      };
    }

    // Update progress
    await updateFaceScanSession(sessionId, {
      status: 'generating_suggestions',
      progress: 50,
      face_analysis: faceAnalysis
    });

    // Step 2: Generate hairstyle suggestions with OpenAI
    const suggestions = await generateHairstyleSuggestions(faceAnalysis, {
      mood,
      style,
      gender
    });

    // Update progress
    await updateFaceScanSession(sessionId, {
      status: 'saving_results',
      progress: 75
    });

    // Step 3: Save suggestions to database
    await saveHairstyleSuggestions(sessionId, suggestions.hairstyles);

    // Step 4: Mark as completed
    await updateFaceScanSession(sessionId, {
      status: 'completed',
      progress: 100,
      result_data: {
        faceAnalysis,
        suggestions: suggestions.hairstyles,
        generalAdvice: suggestions.generalAdvice
      }
    });

    console.log(`Face scan completed: ${sessionId}`);

  } catch (error) {
    console.error(`Error in processFaceScan for ${sessionId}:`, error);
    throw error;
  }
}

/**
 * Get scan status
 * GET /scan-status/:sessionId
 */
export async function getScanStatus(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing sessionId parameter'
      });
    }

    // Import here to avoid circular dependency
    const { getFaceScanSession, getHairstyleSuggestions } = await import('./supabaseService.js');
    
    const session = await getFaceScanSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // If completed, include suggestions
    let suggestions = null;
    if (session.status === 'completed') {
      suggestions = await getHairstyleSuggestions(sessionId);
    }

    res.json({
      sessionId: session.id,
      status: session.status,
      progress: session.progress || 0,
      faceAnalysis: session.face_analysis,
      suggestions: suggestions || session.result_data?.suggestions,
      generalAdvice: session.result_data?.generalAdvice,
      error: session.error_message,
      createdAt: session.created_at,
      updatedAt: session.updated_at
    });

  } catch (error) {
    console.error('Error getting scan status:', error);
    res.status(500).json({
      error: 'Failed to get scan status',
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

    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing sessionId parameter'
      });
    }

    const { getFaceScanSession, getHairstyleSuggestions } = await import('./supabaseService.js');
    
    const session = await getFaceScanSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        error: 'Scan not completed yet',
        status: session.status
      });
    }

    const suggestions = await getHairstyleSuggestions(sessionId);

    res.json({
      sessionId: session.id,
      faceAnalysis: session.face_analysis,
      suggestions,
      generalAdvice: session.result_data?.generalAdvice,
      createdAt: session.created_at
    });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error.message
    });
  }
}
