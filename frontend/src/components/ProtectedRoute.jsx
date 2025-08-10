import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Lock } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowGuest = false,
  redirectTo = '/login',
  fallback = null 
}) => {
  const { session, loading, user, isGuest } = useSession();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Loading...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Checking your authentication status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication requirements
  if (requireAuth) {
    // If authentication is required but user is not authenticated and guest mode is not allowed
    if (!session && !isGuest) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    // If authentication is required, guest mode is not allowed, but user is in guest mode
    if (!allowGuest && isGuest) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
  }

  // If route requires no authentication but user is authenticated, redirect to app
  if (!requireAuth && (session || isGuest)) {
    return <Navigate to="/app" replace />;
  }

  // Render the protected content
  return children;
};

// Higher-order component for easier usage
export const withProtectedRoute = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific route guards for common use cases
export const AuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} allowGuest={false} {...props}>
    {children}
  </ProtectedRoute>
);

export const GuestAllowedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} allowGuest={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={false} {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children, ...props }) => {
  const { userRole } = useSession();
  
  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
            >
              Go Back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthenticatedRoute {...props}>
      {children}
    </AuthenticatedRoute>
  );
};

export default ProtectedRoute;

