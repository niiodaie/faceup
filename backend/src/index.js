import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
/* =========================================================
   ENV
   ========================================================= */
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* =========================================================
   IMPORTS (AFTER app INIT)
   ========================================================= */

// Core AI handlers
import { handleFaceScan, getScanStatus, getSuggestions } from './faceScan.js';

// Stripe
import { handleStripeWebhook } from './webhooks/stripeWebhook.js';
import { createCheckoutSession, getSubscriptionStatus } from './stripe.js';


// Entitlements (Free / Trial / Pro resolution)
import { resolveEntitlements } from './entitlements.js';

// Email retargeting / analytics
import { trackEmail } from './trackEmail.js';


/* =========================================================
   STRIPE WEBHOOK — MUST BE FIRST (RAW BODY)
   ========================================================= */
app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

/* =========================================================
   CORS CONFIG
   ========================================================= */
const allowedOrigins = [
  'https://www.faceupstyle.com',
  'https://faceupstyle.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

/* =========================================================
   BODY PARSERS (AFTER WEBHOOK)
   ========================================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   FILE UPLOAD CONFIG
   ========================================================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

/* =========================================================
   HEALTH CHECK
   ========================================================= */
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'FaceUp Backend API',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/* =========================================================
   AI / FACE SCAN ROUTES
   ========================================================= */
app.post('/face-scan', handleFaceScan);
app.post('/ai/analyze', handleFaceScan);
app.get('/scan-status/:sessionId', getScanStatus);
app.get('/suggestions/:sessionId', getSuggestions);

/* =========================================================
   STRIPE ROUTES (NON-WEBHOOK)
   ========================================================= */
app.post('/stripe/create-checkout', createCheckoutSession);
app.get('/stripe/subscription/:userId', getSubscriptionStatus);

/* =========================================================
   ENTITLEMENTS (🔥 PHASE C DEPENDS ON THIS)
   ========================================================= */
app.get('/entitlements/:userId', async (req, res) => {
  try {
    const entitlements = await resolveEntitlements(req.params.userId);
    res.json(entitlements);
  } catch (err) {
    console.error('Entitlement error:', err);
    res.status(500).json({ error: 'Entitlement resolution failed' });
  }
});

/* =========================================================
   EMAIL RETARGETING / ANALYTICS
   ========================================================= */
app.post('/track/email', trackEmail);


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { uploadImage } = await import('./supabaseService.js');

    const filePath = `uploads/${Date.now()}-${req.file.originalname}`;

    const imageUrl = await uploadImage(
      'faceup-uploads',
      filePath,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/* =========================================================
   PROFILE
   ========================================================= */
app.get('/profile/:userId', async (req, res) => {
  try {
    const { supabase } = await import('./supabaseService.js');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Profile fetch failed' });
  }
});

/* =========================================================
   SCAN HISTORY
   ========================================================= */
app.get('/history/:userId', async (req, res) => {
  try {
    const { supabase } = await import('./supabaseService.js');
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const { data, error } = await supabase
      .from('face_scan_sessions')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ sessions: data });
  } catch {
    res.status(500).json({ error: 'History fetch failed' });
  }
});

/* =========================================================
   FEEDBACK
   ========================================================= */
app.post('/feedback', async (req, res) => {
  try {
    const { supabase } = await import('./supabaseService.js');

    const { data, error } = await supabase
      .from('feedback')
      .insert({ ...req.body, created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, feedback: data });
  } catch {
    res.status(500).json({ error: 'Feedback failed' });
  }
});

/* =========================================================
   ERROR HANDLING
   ========================================================= */
app.use((err, _, res, __) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* =========================================================
   404
   ========================================================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

/* =========================================================
   START SERVER
   ========================================================= */
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  FaceUp Backend API                 ║
║  Port: ${PORT}                      ║
║  Env: ${process.env.NODE_ENV || 'dev'}               ║
╚══════════════════════════════════════╝
  `);
});

export default app;
