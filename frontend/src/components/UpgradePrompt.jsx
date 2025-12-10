import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Sparkles } from 'lucide-react';

const UpgradePrompt = ({ feature, userRole, onUpgrade }) => {
  const getPromptText = () => {
    switch (feature) {
      case 'save_images':
        return {
          title: 'Save Your Looks',
          description: 'Save your scanned images and style suggestions to your personal gallery.',
          action: 'Upgrade to Pro to save unlimited looks'
        };
      case 'ar_tryOn':
        return {
          title: 'AR Try-On',
          description: 'See how different styles look on you with our advanced AR technology.',
          action: 'Upgrade to Pro for AR try-on'
        };
      case 'unlimited_suggestions':
        return {
          title: 'Unlimited Suggestions',
          description: 'Get personalized style recommendations for every mood and occasion.',
          action: 'Upgrade to Pro for unlimited suggestions'
        };
      default:
        return {
          title: 'Premium Feature',
          description: 'This feature is available for Pro users.',
          action: 'Upgrade to Pro'
        };
    }
  };

  const { title, description, action } = getPromptText();

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl font-bold text-purple-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button
          onClick={onUpgrade}
          className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5" />
          {action}
        </Button>
        <p className="mt-3 text-sm text-gray-500">
          {userRole === 'guest' ? 'Sign up for free to get started' : 'Unlock all features with Pro'}
        </p>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;

