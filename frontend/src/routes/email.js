import { supabase } from '../supabaseService.js';

export async function trackEmail(req, res) {
  const { event, metadata } = req.body;
  const user = req.user;

  if (!user) return res.status(401).end();

  await supabase.from('email_events').insert({
    user_id: user.id,
    event,
    metadata,
  });

  res.json({ success: true });
}
