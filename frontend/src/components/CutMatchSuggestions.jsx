import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Lock, Sparkles } from 'lucide-react';
import AdBanner from './AdBanner';

const CutMatchSuggestions = ({
  selectedMoods = [],
  entitlements,
}) => {
  /* ======================================
     SAFETY: ENTITLEMENTS NOT READY
     ====================================== */
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
    showAds = false,
  } = entitlements;

  /* ======================================
     HARD BLOCK — NO ACCESS AT ALL
     ====================================== */
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

  /* ======================================
     BASIC SUGGESTIONS (FREE + ABOVE)
     ====================================== */
  const renderBasicSuggestions = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Style Suggestions</h3>
        <p className="text-sm text-gray-600">
          Based on your mood
          {selectedMoods.length ? `: ${selectedMoods.join(', ')}` : ''}
        </p>
      </div>

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

  /* ======================================
     UPGRADE BLOCK (FREE USERS)
     ====================================== */
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
        <li>• Event-based looks</li>
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

  /* ======================================
     ADVANCED SUGGESTIONS (PRO / TRIAL)
     ====================================== */
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

  /* ======================================
     FINAL RENDER FLOW (C5)
     ====================================== */
  return (
    <div className="space-y-6">
      {/* BASIC (ALL PLANS) */}
      {renderBasicSuggestions()}

      {/* FREE PLAN ADS */}
      {showAds && (
        <div className="my-4">
          <AdBanner />
        </div>
      )}

      {/* ADVANCED OR UPGRADE */}
      {features.advancedSuggestions
        ? renderAdvancedSuggestions()
        : renderUpgradeBlock()}

      {/* FREE PLAN ADS — SECOND SLOT */}
      {showAds && (
        <div className="mt-6">
          <AdBanner />
        </div>
      )}
    </div>
  );
};

export default CutMatchSuggestions;
