import React from 'react';

/**
 * Buy Me a Coffee Support Component
 * Shows donation CTA for guest and free users
 */
export default function SupportUs({ variant = 'default' }) {
  const buyMeCoffeeUrl = 'https://www.buymeacoffee.com/partners';

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center py-4">
        <a
          href={buyMeCoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors duration-200"
        >
          <span>☕</span>
          <span>Support FaceUp</span>
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="text-center py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Love FaceUp? Support our work!
        </p>
        <a
          href={buyMeCoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium transition-colors"
        >
          <span>☕</span>
          <span>Buy us a coffee</span>
        </a>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start gap-4">
        <div className="text-4xl">☕</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Enjoying FaceUp?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Help us keep FaceUp free and awesome! Your support helps us improve the AI, 
            add new features, and keep the service running smoothly for everyone.
          </p>
          <a
            href={buyMeCoffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <span>☕</span>
            <span>Buy us a coffee</span>
          </a>
        </div>
      </div>
    </div>
  );
}
