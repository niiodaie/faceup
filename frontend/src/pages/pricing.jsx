import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const STRIPE_MONTHLY_PRICE = import.meta.env.VITE_STRIPE_MONTHLY || 'price_1ScpVuDMu46n2OkGM6fZUv4h';
  const STRIPE_YEARLY_PRICE = import.meta.env.VITE_STRIPE_YEARLY || 'price_1ScpTgDMu46n2OkGbPS5gzqQ';

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '1 face scan',
        'Basic hairstyle suggestions',
        'Limited makeup recommendations',
        'Ad-supported experience'
      ],
      cta: 'Current Plan',
      priceId: null,
      highlighted: false
    },
    {
      name: 'Monthly Pro',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited face scans',
        'Advanced AI hairstyle suggestions',
        'Complete makeup recommendations',
        'Occasion-based looks',
        'Ad-free experience',
        'Priority support',
        'Save scan history'
      ],
      cta: 'Subscribe Monthly',
      priceId: STRIPE_MONTHLY_PRICE,
      highlighted: true
    },
    {
      name: 'Yearly Pro',
      price: '$99.99',
      period: 'per year',
      savings: 'Save $20!',
      features: [
        'Unlimited face scans',
        'Advanced AI hairstyle suggestions',
        'Complete makeup recommendations',
        'Occasion-based looks',
        'Ad-free experience',
        'Priority support',
        'Save scan history',
        '2 months free'
      ],
      cta: 'Subscribe Yearly',
      priceId: STRIPE_YEARLY_PRICE,
      highlighted: false
    }
  ];

  const handleSubscribe = async (priceId, planName) => {
    if (!priceId) return;

    if (isGuest || !user) {
      navigate('/signup', { state: { returnTo: '/pricing' } });
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      const response = await fetch(`${API_URL}/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          priceId: priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unlock the full power of AI-powered beauty recommendations and transform your style
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.highlighted ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              {plan.savings && (
                <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
                  {plan.savings}
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={!plan.priceId || (loading && selectedPlan === plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                      : plan.priceId
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading && selectedPlan === plan.name ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital wallets through Stripe's secure payment processing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use industry-standard encryption and never store your payment information. All face scans are processed securely and can be deleted at any time.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I switch between plans?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Back to App */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/app')}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Back to App
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
