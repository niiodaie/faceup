import { supabase } from './supabaseService.js';

export async function trackEmail(req, res) {
  try {
    const {
      userId = null,
      email = null,
      event,
      placement = null,
      metadata = {}
    } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Missing event type' });
    }

    // 🔒 Prevent spammy duplicates (same event in 24h)
    const { data: existing } = await supabase
      .from('email_events')
      .select('id')
      .eq('event_type', event)
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existing?.length) {
      return res.json({ success: true, skipped: true });
    }

    const { error } = await supabase.from('email_events').insert({
      user_id: userId,
      email,
      event_type: event,
      placement,
      metadata
    });

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('Email tracking error:', err);
    res.status(500).json({ error: 'Tracking failed' });
  }
}
