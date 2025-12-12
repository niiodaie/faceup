import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

// Core handlers
import { handleFaceScan, getScanStatus, getSuggestions } from './faceScan.js';

// Stripe (separated responsibilities)
import { handleStripeWebhook } from './webhooks/stripeWebhook.js';
import { createCheckoutSession, getSubscriptionStatus } from './routes/stripe.js';

import { resolveEntitlements } from './entitlements.js';

app.get('/entitlements/:userId', async (req, res) => {
  try {
    const entitlements = await resolveEntitlements(req.params.userId);
    res.json(entitlements);
  } catch (err) {
    console.error('Entitlement error:', err);
    res.status(500).json({ error: 'Entitlement resolution failed' });
  }
});


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* =========================================================
   STRIPE WEBHOOK (MUST BE FIRST — RAW BODY, NO CORS)
   ========================================================= */
app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

/* =========================================================
   CORS CONFIGURATION
   ========================================================= */
const allowedOrigins = [
  'https://www.faceupstyle.com',
  'https://faceupstyle.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server / mobile / Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  }
});

/* =========================================================
   HEALTH CHECK
   ========================================================= */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FaceUp Backend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/* =========================================================
   FACE SCAN ROUTES
   ========================================================= */
app.post('/face-scan', handleFaceScan);
app.post('/ai/analyze', handleFaceScan); // alias
app.get('/scan-status/:sessionId', getScanStatus);
app.get('/suggestions/:sessionId', getSuggestions);

/* =========================================================
   STRIPE ROUTES (NON-WEBHOOK)
   ========================================================= */
app.post('/stripe/create-checkout', createCheckoutSession);
app.get('/stripe/subscription/:userId', getSubscriptionStatus);

/* =========================================================
   IMAGE UPLOAD
   ========================================================= */
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { uploadImage } = await import('./supabaseService.js');

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filePath = `uploads/${filename}`;

    const publicUrl = await uploadImage(
      'faceup-uploads',
      filePath,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ success: true, imageUrl: publicUrl });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/* =========================================================
   USER PROFILE
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

  } catch (error) {
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

  } catch (error) {
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
      .insert({
        ...req.body,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, feedback: data });

  } catch (error) {
    res.status(500).json({ error: 'Feedback failed' });
  }
});

/* =========================================================
   ERROR HANDLING
   ========================================================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* =========================================================
   404 HANDLER
   ========================================================= */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

/* =========================================================
   SERVER START
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
