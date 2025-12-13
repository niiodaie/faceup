const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function trackEmailEvent({
  event,
  placement,
  metadata = {},
  user,
}) {
  // Only track logged-in FREE users
  if (!user || user.plan !== 'free') return;

  try {
    await fetch(`${API_URL}/track/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        userId: user.id,
        email: user.email,
        placement,
        metadata,
      }),
    });
  } catch (err) {
    // silent fail — NEVER block UI
    console.warn('Email tracking failed', err);
  }
}
