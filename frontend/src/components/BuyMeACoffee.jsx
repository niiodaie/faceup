import React from 'react';
import { useSession } from '../hooks/useSession.jsx';

/**
 * Buy Me a Coffee Component
 * Shows donation CTA for guest users only
 */
const BuyMeACoffee = ({ variant = 'default' }) => {
  const { isGuest, user } = useSession();
  const BMAC_URL = import.meta.env.VITE_BMAC_URL || 'https://www.buymeacoffee.com/partners';

  // Only show for guest users
  if (!isGuest && user) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center py-4">
        <a
          href={BMAC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <span>☕</span>
          <span>Support FaceUp</span>
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="text-center py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          Love FaceUp? Support our work!
        </p>
        <a
          href={BMAC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
        >
          <span>☕</span>
          <span>Buy us a coffee</span>
        </a>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="text-4xl">☕</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enjoying FaceUp?
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Help us keep FaceUp free and awesome! Your support helps us improve the AI, 
            add new features, and keep the service running smoothly for everyone.
          </p>
          <a
            href={BMAC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <span>☕</span>
            <span>Buy us a coffee</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BuyMeACoffee;
