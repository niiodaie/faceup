/**
 * FaceUp API Service
 * Real API calls to backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Handle API errors consistently
 */
function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data?.message || error.response.data?.error || 'Server error');
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

/**
 * Upload image to backend
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Start face scan
 */
export async function startFaceScan(userId, imageUrl, mood, style, gender) {
  try {
    const response = await fetch(`${API_BASE_URL}/face-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId || null,
        imageUrl,
        mood: mood || 'versatile',
        style: style || 'modern',
        gender: gender || 'unspecified'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start face scan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get scan status
 */
export async function getScanStatus(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/scan-status/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get scan status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get hairstyle suggestions
 */
export async function getSuggestions(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/suggestions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get suggestions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Poll scan status until completed
 */
export async function pollScanStatus(sessionId, onProgress, maxAttempts = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const status = await getScanStatus(sessionId);
    
    if (onProgress) {
      onProgress(status);
    }

    if (status.status === 'completed') {
      return status;
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'Face scan failed');
    }

    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  throw new Error('Scan timeout - please try again');
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get user scan history
 */
export async function getUserHistory(userId, limit = 10, offset = 0) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/history/${userId}?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get history');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Submit feedback
 */
export async function submitFeedback(userId, sessionId, rating, comment, feedbackType) {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        sessionId,
        rating,
        comment,
        feedbackType
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit feedback');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
        successUrl,
        cancelUrl
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/subscription/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get subscription status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Health check
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { status: 'error', online: false };
    }

    const data = await response.json();
    return { ...data, online: true };
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'error', online: false };
  }
}
