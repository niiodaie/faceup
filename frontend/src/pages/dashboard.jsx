import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';
import Header from '../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session, loading, signOut } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }

    // Show success message if redirected from successful payment
    if (searchParams.get('success') === 'true') {
      alert('🎉 Welcome to FaceUp Pro! Your subscription is now active.');
    }
  }, [user, loading, navigate, searchParams]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);

      // Fetch subscription status
      const subResponse = await fetch(`${API_URL}/stripe/subscription/${user.id}`);
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData);
      }

      // Fetch scan history
      const historyResponse = await fetch(`${API_URL}/history/${user.id}?limit=10`);
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setScanHistory(historyData.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header
          session={session}
          user={user}
          onLogout={handleLogout}
        />

        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome back, {user?.email?.split('@')[0] || 'Beauty'}! ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Your personalized beauty dashboard
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Subscription Status</h2>
          {subscription?.hasSubscription ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold">
                    {subscription.planType === 'monthly' ? 'Monthly Pro' : 'Yearly Pro'}
                  </span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <p className="text-gray-600">
                  Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Manage Subscription
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You're currently on the free plan</p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/app')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-3">📸</div>
            <h3 className="font-bold text-lg mb-2">New Scan</h3>
            <p className="text-gray-600 text-sm">Start a new face analysis</p>
          </button>

          <button
            onClick={() => navigate('/face-scan')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-3">💄</div>
            <h3 className="font-bold text-lg mb-2">Style Finder</h3>
            <p className="text-gray-600 text-sm">Discover your perfect look</p>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-bold text-lg mb-2">Go Pro</h3>
            <p className="text-gray-600 text-sm">Unlock all features</p>
          </button>
        </div>

        {/* Scan History */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Scans</h2>
          {scanHistory.length > 0 ? (
            <div className="space-y-4">
              {scanHistory.map((scan, index) => (
                <div
                  key={scan.id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl">
                      📸
                    </div>
                    <div>
                      <p className="font-semibold">
                        {scan.status === 'completed' ? 'Scan Complete' : 'Processing...'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(scan.created_at).toLocaleDateString()} at{' '}
                        {new Date(scan.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {scan.status === 'completed' && (
                    <button
                      onClick={() => navigate(`/results/${scan.id}`)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      View Results
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 mb-4">No scans yet</p>
              <button
                onClick={() => navigate('/app')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Start Your First Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
