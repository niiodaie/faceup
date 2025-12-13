import React from 'react';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';
import { getSponsoredLooks } from '../lib/sponsoredLooksEngine';
import { track } from '../lib/track';

const SponsoredProLooks = ({ moods = [], occasion }) => {
  const looks = getSponsoredLooks({ moods, occasion });

  if (!looks.length) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-pink-600" />
        <h3 className="text-xl font-bold">Sponsored Pro Looks</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {looks.map((look) => (
          <Card key={look.id} className="overflow-hidden rounded-2xl shadow-lg">
            <div className="relative">
              <img
                src={look.image}
                alt={look.name}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-3 right-3 text-xs bg-black/70 text-white px-3 py-1 rounded-full">
                Sponsored
              </span>
            </div>

            <div className="p-5">
              <h4 className="font-bold text-lg">{look.name}</h4>
              <p className="text-sm text-gray-600 mb-3">
                by {look.brand}
              </p>

              <button
                onClick={() => {
                  track('sponsored_look_click', {
                    lookId: look.id,
                    sponsor: look.sponsor,
                  });
                  window.open(look.url, '_blank');
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
              >
                {look.cta}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsoredProLooks;
