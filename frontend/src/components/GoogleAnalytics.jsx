import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics Component
 * Tracks page views and custom events
 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_ID = import.meta.env.VITE_GA_ID || 'G-YHXYD6VR5R';
  const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';

  useEffect(() => {
    if (!ENABLE_ANALYTICS || process.env.NODE_ENV !== 'production') {
      return;
    }

    // Track page view
    if (window.gtag) {
      window.gtag('config', GA_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, GA_ID, ENABLE_ANALYTICS]);

  return null;
};

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('GA Event (dev):', eventName, params);
    return;
  }

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track face scan event
 */
export const trackFaceScan = (userId = null) => {
  trackEvent('face_scan', {
    user_id: userId,
    user_type: userId ? 'registered' : 'guest',
  });
};

/**
 * Track subscription event
 */
export const trackSubscription = (planType, userId) => {
  trackEvent('subscribe', {
    plan_type: planType,
    user_id: userId,
  });
};

/**
 * Track upgrade prompt view
 */
export const trackUpgradePrompt = (feature) => {
  trackEvent('upgrade_prompt_view', {
    feature: feature,
  });
};

export default GoogleAnalytics;
