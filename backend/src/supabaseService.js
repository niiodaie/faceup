import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Missing Supabase environment variables - some features will be disabled');
  console.warn('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

// Create Supabase client with service role key for backend operations
export const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Save face scan session to database
 */
export async function saveFaceScanSession(data) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping session save');
    return { id: data.sessionId, status: 'processing' };
  }
  
  const { userId, imageUrl, mood, style, sessionId } = data;
  
  const { data: session, error } = await supabase
    .from('face_scan_sessions')
    .insert({
      id: sessionId,
      user_id: userId,
      image_url: imageUrl,
      mood,
      style,
      status: 'processing',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving face scan session:', error);
    throw error;
  }

  return session;
}

/**
 * Update face scan session status and result
 */
export async function updateFaceScanSession(sessionId, updates) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping session update');
    return { id: sessionId, ...updates };
  }
  
  const { data, error } = await supabase
    .from('face_scan_sessions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating face scan session:', error);
    throw error;
  }

  return data;
}

/**
 * Get face scan session by ID
 */
export async function getFaceScanSession(sessionId) {
  if (!supabase) {
    console.warn('Supabase not configured - returning null session');
    return null;
  }
  
  const { data, error } = await supabase
    .from('face_scan_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching face scan session:', error);
    throw error;
  }

  return data;
}

/**
 * Save hairstyle suggestions to database
 */
export async function saveHairstyleSuggestions(sessionId, suggestions) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping suggestions save');
    return [];
  }
  
  const suggestionRecords = suggestions.map(suggestion => ({
    session_id: sessionId,
    hairstyle_name: suggestion.name,
    description: suggestion.description,
    image_url: suggestion.imageUrl,
    confidence_score: suggestion.confidence || 0.85,
    created_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('hairstyle_suggestions')
    .insert(suggestionRecords)
    .select();

  if (error) {
    console.error('Error saving hairstyle suggestions:', error);
    throw error;
  }

  return data;
}

/**
 * Get hairstyle suggestions for a session
 */
export async function getHairstyleSuggestions(sessionId) {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty suggestions');
    return [];
  }
  
  const { data, error } = await supabase
    .from('hairstyle_suggestions')
    .select('*')
    .eq('session_id', sessionId)
    .order('confidence_score', { ascending: false });

  if (error) {
    console.error('Error fetching hairstyle suggestions:', error);
    throw error;
  }

  return data;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(bucket, filePath, fileBuffer, contentType) {
  if (!supabase) {
    throw new Error('Supabase not configured - cannot upload images');
  }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Update user subscription status
 */
export async function updateSubscription(userId, subscriptionData) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping subscription update');
    return null;
  }
  
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: subscriptionData.customerId,
      stripe_subscription_id: subscriptionData.subscriptionId,
      status: subscriptionData.status,
      plan_type: subscriptionData.planType,
      current_period_start: subscriptionData.currentPeriodStart,
      current_period_end: subscriptionData.currentPeriodEnd,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return data;
}

/**
 * Get user subscription
 */
export async function getUserSubscription(userId) {
  if (!supabase) {
    console.warn('Supabase not configured - returning null subscription');
    return null;
  }
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching subscription:', error);
    throw error;
  }

  return data;
}

/**
 * Check and update usage limits
 */
export async function checkUsageLimit(userId) {
  const { data, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching usage limits:', error);
    throw error;
  }

  return data;
}

/**
 * Increment usage count
 */
export async function incrementUsage(userId) {
  const { data, error } = await supabase.rpc('increment_scan_count', {
    p_user_id: userId
  });

  if (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }

  return data;
}
