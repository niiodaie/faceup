// components/CheckoutCard.jsx
import CheckoutButtons from "./CheckoutButtons";

export default function CheckoutCard() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border shadow-md p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        FaceUp Premium
      </h2>
      <p className="text-gray-600 mb-6">
        Unlock AI Style Recommendations, Face Shape Analysis, 
        Skin Insights & Unlimited Hairstyle Matches.
      </p>

      <ul className="text-left text-gray-700 mb-4 space-y-2">
        <li>✓ Unlimited AI Face Scans</li>
        <li>✓ Personalized Style & Beauty Analysis</li>
        <li>✓ Smart Hairstyle Recommendations</li>
        <li>✓ Advanced Face Shape Mapping</li>
        <li>✓ Priority Processing</li>
      </ul>

      <CheckoutButtons />
    </div>
  );
}
