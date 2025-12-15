import React from 'react';
import IntroPage from '../components/IntroPage';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <IntroPage onGuestDemo={() => navigate('/app/guest')} />
  );
}
