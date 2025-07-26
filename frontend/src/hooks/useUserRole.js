import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useUserRole = (user) => {
  const [userRole, setUserRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserRole('guest');
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        // Check if user has metadata with role
        const role = user.user_metadata?.role || 'free';
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('free'); // Default to free on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { userRole, loading };
};

export const USER_ROLES = {
  GUEST: 'guest',
  FREE: 'free',
  PRO: 'pro'
};

export const hasAccess = (userRole, feature) => {
  const permissions = {
    [USER_ROLES.GUEST]: ['view_demo', 'view_affiliates'],
    [USER_ROLES.FREE]: ['view_demo', 'view_affiliates', 'face_scan', 'limited_suggestions'],
    [USER_ROLES.PRO]: ['view_demo', 'view_affiliates', 'face_scan', 'unlimited_suggestions', 'save_images', 'ar_tryOn', 'history']
  };

  return permissions[userRole]?.includes(feature) || false;
};

