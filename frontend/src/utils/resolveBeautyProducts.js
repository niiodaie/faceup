export function resolveBeautyProducts({ moods = [], occasion, sponsored = false }) {
  // Sponsored products override organic ones
  if (sponsored) {
    return [
      {
        id: 'sponsored-glam-kit',
        name: 'Luxury Event Glam Kit',
        brand: 'Sponsored Brand',
        price: '$89',
        retailer: 'sephora',
        affiliateId: 'luxury-glam-kit',
        sponsored: true,
      },
    ];
  }

  // Mood → product mapping
  if (moods.includes('wedding') || occasion === 'wedding') {
    return [
      {
        id: 'bridal-foundation',
        name: 'Longwear Bridal Foundation',
        brand: 'Fenty Beauty',
        price: '$48',
        retailer: 'sephora',
        affiliateId: 'pro-filtr-soft-matte',
      },
      {
        id: 'bridal-setting-spray',
        name: 'All-Nighter Setting Spray',
        brand: 'Urban Decay',
        price: '$36',
        retailer: 'amazon',
        affiliateId: 'B00D5Q7X5C',
      },
    ];
  }

  // Default daily look
  return [
    {
      id: 'everyday-glow',
      name: 'Everyday Glow Makeup Kit',
      brand: 'Maybelline',
      price: '$29',
      retailer: 'amazon',
      affiliateId: 'B09GJZ5K2P',
    },
  ];
}
