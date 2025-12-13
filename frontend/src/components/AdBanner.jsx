export default function AdBanner() {
  return (
    <div className="my-6 rounded-xl border border-pink-200 bg-pink-50 p-4 text-center">
      <p className="text-sm text-gray-600 mb-2">
        Sponsored • Upgrade to remove ads
      </p>

      {/* Replace with AdSense later */}
      <div className="h-20 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg flex items-center justify-center font-semibold text-pink-700">
        Ad Space
      </div>
    </div>
  );
}
