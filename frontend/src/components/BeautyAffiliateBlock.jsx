import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { AFFILIATES } from '../config/affiliateConfig';
import { resolveBeautyProducts } from '../utils/resolveBeautyProducts';

const BeautyAffiliateBlock = ({
  moods = [],
  occasion,
  entitlements,
}) => {
  // 🔒 Pro users NEVER see ads
  if (entitlements?.plan === 'pro') return null;

  const products = resolveBeautyProducts({
    moods,
    occasion,
    sponsored: false,
  });

  const buildLink = (product) => {
    const retailer = AFFILIATES[product.retailer];
    return `${retailer.baseUrl}${product.affiliateId}?tag=${retailer.tag}`;
  };

  const trackClick = (product) => {
    // 🔁 GA / Meta stub
    window.dispatchEvent(
      new CustomEvent('affiliate_click', {
        detail: {
          productId: product.id,
          retailer: product.retailer,
        },
      })
    );
  };

  return (
    <Card className="p-6 rounded-3xl bg-white/90 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">
        💄 Beauty Picks for You
      </h3>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border rounded-xl p-4"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">
                {product.brand} • {product.price}
              </p>

              {product.sponsored && (
                <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-1">
                  <Star className="h-3 w-3" /> Sponsored
                </span>
              )}
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => {
                trackClick(product);
                window.open(buildLink(product), '_blank');
              }}
            >
              Shop <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Affiliate links support FaceUp 💜
      </p>
    </Card>
  );
};

export default BeautyAffiliateBlock;
