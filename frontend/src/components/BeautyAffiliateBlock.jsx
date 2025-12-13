import React from 'react';
import { Card } from './ui/card';
import { Sparkles, ExternalLink } from 'lucide-react';

const affiliates = [
  {
    brand: 'Fenty Beauty',
    product: 'Gloss Bomb Universal Lip Luminizer',
    image: '/affiliates/fenty-gloss.jpg',
    cta: 'Shop on Sephora',
    link: 'https://sephora.com?affiliate_id=YOUR_ID',
  },
  {
    brand: 'MAC',
    product: 'Studio Fix Fluid Foundation',
    image: '/affiliates/mac-foundation.jpg',
    cta: 'View on Ulta',
    link: 'https://ulta.com?affiliate_id=YOUR_ID',
  },
  {
    brand: 'Dyson',
    product: 'Airwrap Styler',
    image: '/affiliates/dyson-airwrap.jpg',
    cta: 'Check Price',
    link: 'https://amazon.com?tag=YOUR_ID',
  },
];

const BeautyAffiliateBlock = () => {
  const item = affiliates[Math.floor(Math.random() * affiliates.length)];

  return (
    <Card className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-pink-600" />
        <span className="font-semibold text-purple-800">
          Recommended Beauty Pick
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.product}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500">{item.brand}</p>
          <p className="font-semibold text-gray-800">{item.product}</p>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-purple-600 hover:underline"
          >
            {item.cta}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
};

export default BeautyAffiliateBlock;
