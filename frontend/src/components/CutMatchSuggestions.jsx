import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Lock, Sparkles } from 'lucide-react';

const CutMatchSuggestions = ({
  selectedMoods = [],
  entitlements,
}) => {
  /**
   * SAFETY: If entitlements not loaded yet
   */
  if (!entitlements) {
    return (
      <Card className="p-6 text-center rounded-3xl shadow-md">
        Loading suggestions…
      </Card>
    );
  }

  const {
    features = {},
    plan = 'free',
    isTrial = false,
  } = entitlements;

  /**
   * HARD BLOCK — No suggestions at all
   * (unlikely, but safe)
   */
  if (!features.basicSuggestions) {
    return (
      <Card className="p-6 text-center rounded-3xl shadow-lg">
        <Lock className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <h3 className="font-semibold mb-2">Suggestions Locked</h3>
        <p className="text-gray-600 mb-4">
          Upgrade to unlock personalized style suggestions.
        </p>
        <Button
          onClick={() => (window.location.href = '/pricing')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6"
        >
          Upgrade Now
        </Button>
      </Card>
    );
  }

  /**
   * BASIC SUGGESTIONS (FREE + ABOVE)
   */
  const renderBasicSuggestions = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Style Suggestions</h3>
        <p className="text-sm text-gray-600">
          Based on your mood{selectedMoods.length ? `: ${selectedMoods.join(', ')}` : ''}
        </p>
      </div>

      {/* Placeholder demo suggestions */}
      <div className="grid grid-cols-2 gap-4">
        {['Soft Glam', 'Natural Glow', 'Classic Waves', 'Sleek Bob'].map((style) => (
          <Card
            key={style}
            className="p-3 text-center rounded-xl bg-white/80 shadow-sm"
          >
            <div className="h-24 bg-pink-100 rounded-lg mb-2" />
            <p className="text-sm font-medium">{style}</p>
          </Card>
        ))}
      </div>
    </div>
  );

  /**
   * LOCKED ADVANCED FEATURES (FREE USERS)
   */
  const renderUpgradeBlock = () => (
    <Card className="p-4 mt-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <span className="font-semibold text-purple-800">
          Unlock Pro Styling
        </span>
      </div>

      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        <li>• Advanced AI style matching</li>
        <li>• Event-based looks (weddings, parties, work)</li>
        <li>• Makeup + hair combinations</li>
        <li>• Unlimited saved looks</li>
      </ul>

      <Button
        onClick={() => (window.location.href = '/pricing')}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
      >
        Upgrade to Pro
      </Button>
    </Card>
  );

  /**
   * PRO / TRIAL — ADVANCED FEATURES
   */
  const renderAdvancedSuggestions = () => (
    <Card className="p-4 mt-6 rounded-2xl shadow-md bg-white/90">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-pink-600" />
        <h4 className="font-semibold">
          Advanced AI Styling {isTrial && '(Trial)'}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          'Event Glam',
          'Date Night Glow',
          'Professional Chic',
          'Bold Evening Look',
        ].map((style) => (
          <Card
            key={style}
            className="p-3 text-center rounded-xl bg-gradient-to-br from-pink-50 to-purple-50"
          >
            <div className="h-24 bg-pink-200 rounded-lg mb-2" />
            <p className="text-sm font-medium">{style}</p>
          </Card>
        ))}
      </div>
    </Card>
  );

  /**
   * RENDER FLOW
   */
  return (
    <div className="space-y-6">
      {renderBasicSuggestions()}

      {features.advancedSuggestions
        ? renderAdvancedSuggestions()
        : renderUpgradeBlock()}
    </div>
  );
};

export default CutMatchSuggestions;
