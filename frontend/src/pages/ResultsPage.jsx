import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useSession } from '../hooks/useSession.jsx';
import { useEntitlements } from '../hooks/useEntitlements';

import AdBanner from '../components/AdBanner';
import BeautyAffiliateBlock from '../components/BeautyAffiliateBlock';
import SponsoredProLooks from '../components/SponsoredProLooks';

const ResultsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isGuest } = useSession();
  const { entitlements, loading: entitlementsLoading } = useEntitlements();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  /* =====================================================
     FETCH RESULTS
     ===================================================== */
  useEffect(() => {
    if (!sessionId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/suggestions/${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch results');
        setResults(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  /* =====================================================
     LOADING / ERROR STATES
     ===================================================== */
  if (loading || entitlementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-purple-600" />
      </div>
    );
  }

  if (!results || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
        <div className="bg-white p-8 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-bold mb-3">Results Not Available</h2>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Start New Scan
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     ACCESS FLAGS
     ===================================================== */
  const features = entitlements?.features || {};
  const plan = entitlements?.plan || 'free';
  const showAds = entitlements?.showAds;

  const { faceAnalysis, suggestions, generalAdvice, occasionLooks } = results;

  /* =====================================================
     RENDER
     ===================================================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold gradient-text mb-3">Your Results ✨</h1>
          <p className="text-gray-600 text-lg">AI-powered beauty recommendations</p>
        </div>

        {/* FACE ANALYSIS */}
        {faceAnalysis && (
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Face Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold">Face Shape</h4>
                <p className="text-2xl">{faceAnalysis.faceShape || 'Oval'}</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl">
                <h4 className="font-semibold">Skin Tone</h4>
                <p className="text-2xl">{faceAnalysis.skinTone || 'Warm'}</p>
              </div>
            </div>
          </div>
        )}

        {/* FREE PLAN AD */}
        {showAds && <AdBanner />}

        {/* RECOMMENDED STYLES */}
        {suggestions?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Recommended Styles</h2>

            {suggestions.map((style, idx) => (
              <div key={idx} className="border rounded-xl p-6 mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{style.name}</h3>

                  {/* C5.2 — Confidence Score Blur */}
                  {features.confidenceScore ? (
                    <div className="text-green-600 font-bold text-lg">
                      {Math.round(style.confidence * 100)}%
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="text-gray-400 font-bold blur-sm select-none">
                        92%
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => navigate('/pricing')}
                          className="text-xs bg-white px-3 py-1 rounded-full shadow border text-purple-600 font-semibold"
                        >
                          Unlock Confidence Score
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-700">{style.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* PRO / TRIAL — SPONSORED LOOKS */}
        {plan !== 'free' && (
          <SponsoredProLooks />
        )}

        {/* OCCASION LOOKS */}
        {features.occasionLooks ? (
          occasionLooks && (
            <div className="bg-white rounded-2xl shadow p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Occasion Looks</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(occasionLooks).map(([k, v]) => (
                  <div key={k} className="bg-purple-50 p-5 rounded-xl">
                    <h4 className="font-bold capitalize">{k}</h4>
                    <p className="text-gray-700">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <LockedBlock
            title="Occasion Styling Locked"
            text="Upgrade to Pro to unlock event-based styling."
            onUpgrade={() => navigate('/pricing')}
          />
        )}

        {/* PERSONAL ADVICE */}
        {features.personalAdvice ? (
          generalAdvice && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow mb-6">
              <h2 className="text-2xl font-bold mb-3">Personal Advice</h2>
              <p>{generalAdvice}</p>
            </div>
          )
        ) : (
          <>
            <LockedBlock
              title="Personal Advice Locked"
              text="Upgrade to Pro for personalized beauty insights."
              onUpgrade={() => navigate('/pricing')}
            />

            {/* FREE / TRIAL — AFFILIATE MONETIZATION */}
            {plan === 'free' && (
              <BeautyAffiliateBlock placement="results_personal_advice" />
            )}
          </>
        )}

        {/* GUEST CTA */}
        {isGuest && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Save your results</h3>
            <button
              onClick={() => navigate('/auth/signup')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg"
            >
              Create Free Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   LOCKED BLOCK
   ===================================================== */
const LockedBlock = ({ title, text, onUpgrade }) => (
  <div className="bg-white rounded-2xl shadow p-8 mb-8 text-center">
    <Lock className="mx-auto h-8 w-8 text-gray-400 mb-3" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{text}</p>
    <button
      onClick={onUpgrade}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
    >
      Upgrade to Pro
    </button>
  </div>
);

export default ResultsPage;
