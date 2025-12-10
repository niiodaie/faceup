import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, ShoppingBag, Star } from 'lucide-react';

const AffiliateLinks = ({ userRole }) => {
  const affiliateProducts = [
    {
      id: 1,
      name: 'Professional Makeup Brush Set',
      brand: 'BeautyPro',
      price: '$49.99',
      rating: 4.8,
      image: '/api/placeholder/150/150',
      affiliate_url: 'https://amazon.com/makeup-brushes',
      description: 'Complete 12-piece professional makeup brush set'
    },
    {
      id: 2,
      name: 'HD Foundation Palette',
      brand: 'GlamBase',
      price: '$34.99',
      rating: 4.6,
      image: '/api/placeholder/150/150',
      affiliate_url: 'https://sephora.com/foundation-palette',
      description: 'Multi-shade foundation palette for all skin tones'
    },
    {
      id: 3,
      name: 'Contour & Highlight Kit',
      brand: 'SculptFace',
      price: '$28.99',
      rating: 4.7,
      image: '/api/placeholder/150/150',
      affiliate_url: 'https://ulta.com/contour-kit',
      description: 'Professional contour and highlight palette'
    }
  ];

  const handleAffiliateClick = (product) => {
    // Track affiliate click for analytics
    console.log('Affiliate click:', product.name);
    // In production, this would track the click for commission purposes
    window.open(product.affiliate_url, '_blank');
  };

  return (
    <div className="w-full mt-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Recommended Products
        </h3>
        <p className="text-sm text-gray-600">
          Get the tools to achieve your perfect look
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {affiliateProducts.map((product) => (
          <Card key={product.id} className="bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{product.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{product.description}</p>
                  
                  <Button
                    onClick={() => handleAffiliateClick(product)}
                    size="sm"
                    className="w-full py-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Shop Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          * FaceUp may earn a commission from purchases made through these links
        </p>
      </div>
    </div>
  );
};

export default AffiliateLinks;

