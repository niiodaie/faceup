// frontend/src/lib/track.js
import { trackEvent } from './analytics';

/**
 * Generic event tracker
 * Used by ads, sponsored looks, experiments, etc.
 */
export function track(event, metadata = {}) {
  try {
    trackEvent(event, metadata);
  } catch (err) {
    console.warn('[track] failed', err);
  }
}

/**
 * Email tracking (Free → Pro retargeting)
 */
export async function trackEmailEvent(event, metadata = {}) {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/track/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ event, metadata }),
    });
  } catch (err) {
    console.warn('[trackEmailEvent] failed', err);
  }
}
