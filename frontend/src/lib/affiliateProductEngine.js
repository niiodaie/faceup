/**
 * PRODUCT INTELLIGENCE (Context Engine)
 * -----------------------------------
 * Maps moods / occasions → affiliate products
 * Free users see these inline (non-intrusive)
 * Pro users can later see sponsored looks
 */

export function getProductsForContext(moods = [], occasion) {
  const context =
    (Array.isArray(moods) && moods[0]) ||
    occasion ||
    'default';

  const catalog = {
    wedding: [
      {
        id: 'wed-001',
        name: 'Radiant Bridal Foundation',
        brand: 'Sephora Collection',
        retailer: 'sephora',
        url: 'https://www.sephora.com/?affiliate_id=YOUR_SEPHORA_ID',
        priceHint: '$42',
      },
      {
        id: 'wed-002',
        name: 'All-Nighter Setting Spray',
        brand: 'Urban Decay',
        retailer: 'amazon',
        url: 'https://amzn.to/YOUR_AMAZON_ID',
        priceHint: '$36',
      },
    ],

    glam: [
      {
        id: 'glam-001',
        name: 'Soft Glam Eyeshadow Palette',
        brand: 'Anastasia Beverly Hills',
        retailer: 'sephora',
        url: 'https://www.sephora.com/?affiliate_id=YOUR_SEPHORA_ID',
        priceHint: '$45',
      },
      {
        id: 'glam-002',
        name: 'Volumizing Lash Mascara',
        brand: 'L’Oréal',
        retailer: 'amazon',
        url: 'https://amzn.to/YOUR_AMAZON_ID',
        priceHint: '$14',
      },
    ],

    work: [
      {
        id: 'work-001',
        name: 'Natural Finish Foundation',
        brand: 'Fenty Beauty',
        retailer: 'sephora',
        url: 'https://www.sephora.com/?affiliate_id=YOUR_SEPHORA_ID',
        priceHint: '$40',
      },
    ],

    default: [
      {
        id: 'def-001',
        name: 'Everyday Glow Makeup Kit',
        brand: 'Maybelline',
        retailer: 'amazon',
        url: 'https://amzn.to/YOUR_AMAZON_ID',
        priceHint: '$22',
      },
    ],
  };

  return catalog[context] || catalog.default;
}
