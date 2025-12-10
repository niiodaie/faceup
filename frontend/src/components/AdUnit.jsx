import React, { useEffect } from 'react';

/**
 * Google AdSense Ad Unit Component
 * Displays responsive ads in the application
 */
export default function AdUnit({ 
  slot = 'auto', 
  format = 'auto', 
  responsive = true,
  className = ''
}) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ad Placeholder (Development Mode)
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6074565478510564"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * Horizontal Ad Unit (for between content)
 */
export function HorizontalAd({ className = '' }) {
  return (
    <AdUnit 
      format="horizontal"
      className={`my-6 ${className}`}
    />
  );
}

/**
 * Vertical Ad Unit (for sidebars)
 */
export function VerticalAd({ className = '' }) {
  return (
    <AdUnit 
      format="vertical"
      className={className}
    />
  );
}

/**
 * Square Ad Unit
 */
export function SquareAd({ className = '' }) {
  return (
    <AdUnit 
      format="rectangle"
      className={className}
    />
  );
}
