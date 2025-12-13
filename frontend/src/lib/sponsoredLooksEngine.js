/**
 * Sponsored Pro Looks Engine
 * --------------------------
 * Brand-paid placements
 * Visible only to Pro / Trial
 */

export function getSponsoredLooks({ moods = [], occasion }) {
  const context =
    (Array.isArray(moods) && moods[0]) ||
    occasion ||
    'default';

  const sponsoredCatalog = {
    wedding: [
      {
        id: 'spon-wed-001',
        name: 'Luxury Bridal Glow',
        brand: 'Fenty Beauty',
        sponsor: 'Sephora',
        image: '/sponsored/fenty-bridal.jpg',
        cta: 'Shop the Look',
        url: 'https://www.sephora.com/?affiliate_id=YOUR_SEPHORA_ID',
      },
    ],

    glam: [
      {
        id: 'spon-glam-001',
        name: 'Red Carpet Glam',
        brand: 'Charlotte Tilbury',
        sponsor: 'Charlotte Tilbury',
        image: '/sponsored/ct-glam.jpg',
        cta: 'View Products',
        url: 'https://www.charlottetilbury.com/?aff=YOUR_ID',
      },
    ],

    default: [],
  };

  return sponsoredCatalog[context] || sponsoredCatalog.default;
}
