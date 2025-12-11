import React, { useEffect } from 'react';
import { useSession } from '../hooks/useSession.jsx';

/**
 * Google AdSense Component
 * Only shows ads for guest users and free tier users
 * Pro/paid users get ad-free experience
 */
const AdSense = ({ slot = 'auto', format = 'auto', className = '' }) => {
  const { user, isGuest } = useSession();
  const [subscription, setSubscription] = React.useState(null);
  
  const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-6074565478510564';
  const ENABLE_ADS = import.meta.env.VITE_ENABLE_ADS !== 'false';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Check subscription status for logged-in users
    if (user && !isGuest) {
      fetch(`${API_URL}/stripe/subscription/${user.id}`)
        .then(res => res.json())
        .then(data => setSubscription(data))
        .catch(err => console.error('Failed to check subscription:', err));
    }
  }, [user, isGuest, API_URL]);

  useEffect(() => {
    // Only load ads if enabled and user should see them
    if (ENABLE_ADS && shouldShowAds()) {
      try {
        if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [subscription]);

  const shouldShowAds = () => {
    // Show ads only for guests or free users without active subscription
    if (isGuest) return true;
    if (!user) return true;
    if (subscription?.hasSubscription) return false;
    return true;
  };

  // Don't show ads in development or for paid users
  if (process.env.NODE_ENV !== 'production' || !ENABLE_ADS) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ad Placeholder (Development Mode)
        </p>
      </div>
    );
  }

  if (!shouldShowAds()) {
    return null; // No ads for paid users
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
