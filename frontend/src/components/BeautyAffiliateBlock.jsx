import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { getProductsForContext } from '../lib/affiliateProductEngine';
import { trackAffiliateClick } from '../utils/trackAffiliate';

/**
 * BeautyAffiliateBlock
 * Monetizes FREE + TRIAL users with contextual beauty products
 */
const BeautyAffiliateBlock = ({
  moods = [],
  occasion = '',
  entitlements,
  placement = 'results',
}) => {
  // Pro users see NO ads
  if (entitlements?.plan === 'pro') return null;

  const products = getProductsForContext(moods, occasion);

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-pink-600" />
        <h3 className="font-bold text-lg">Recommended Beauty Picks</h3>
      </div>

      <p className="text-sm text-gray-600 mb-5">
        Products that match your look & occasion
      </p>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAffiliateClick(p, placement)}
            className="border rounded-xl p-3 hover:shadow-md transition group"
          >
            <div className="h-24 bg-pink-100 rounded-lg mb-2" />

            <p className="text-sm font-semibold mb-1 group-hover:text-pink-600">
              {p.name}
            </p>

            <p className="text-xs text-gray-500 mb-2">
              {p.brand}
            </p>

            <div className="flex items-center text-xs text-purple-600 font-semibold">
              Shop Now <ExternalLink className="h-3 w-3 ml-1" />
            </div>
          </a>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        Affiliate links help support FaceUp 💜
      </p>
    </div>
  );
};

export default BeautyAffiliateBlock;
