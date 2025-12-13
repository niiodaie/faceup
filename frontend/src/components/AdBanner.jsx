import React from 'react';

const AdBanner = () => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
      <p className="text-xs text-gray-400 mb-1">Sponsored</p>

      {/* Replace with AdSense / affiliate later */}
      <div className="h-24 flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-sm text-gray-600">
          Your Ad Here
        </span>
      </div>
    </div>
  );
};

export default AdBanner;
