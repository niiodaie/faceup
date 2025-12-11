import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { handleFaceScan, getScanStatus, getSuggestions } from './faceScan.js';
import { 
  handleStripeWebhook, 
  createCheckoutSession, 
  getSubscriptionStatus 
} from './stripeWebhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Stripe webhook needs raw body
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Regular JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FaceUp Backend API',
    version: '1.0.0'
  });
});

// API Routes

// Face scan endpoints
app.post('/face-scan', handleFaceScan);
app.post('/ai/analyze', handleFaceScan); // Alias for face-scan
app.get('/scan-status/:sessionId', getScanStatus);
app.get('/suggestions/:sessionId', getSuggestions);

// Stripe endpoints
app.post('/stripe/create-checkout', createCheckoutSession);
app.get('/stripe/subscription/:userId', getSubscriptionStatus);

// Image upload endpoint
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    const { uploadImage } = await import('./supabaseService.js');
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    const filePath = `uploads/${filename}`;

    // Upload to Supabase Storage
    const publicUrl = await uploadImage(
      'faceup-uploads',
      filePath,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({
      success: true,
      imageUrl: publicUrl,
      filename
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      message: error.message
    });
  }
});

// User profile endpoint
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { supabase } = await import('./supabaseService.js');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

// Get user's scan history
app.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const { supabase } = await import('./supabaseService.js');
    
    const { data, error } = await supabase
      .from('face_scan_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      sessions: data,
      count: data.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message
    });
  }
});

// Save feedback
app.post('/feedback', async (req, res) => {
  try {
    const { userId, sessionId, rating, comment, feedbackType } = req.body;

    const { supabase } = await import('./supabaseService.js');
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        session_id: sessionId,
        rating,
        comment,
        feedback_type: feedbackType,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      feedback: data
    });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      error: 'Failed to save feedback',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   FaceUp Backend API Server          ║
║   Status: Running                     ║
║   Port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║
║   Time: ${new Date().toISOString()}   ║
╚═══════════════════════════════════════╝
  `);
  
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /face-scan');
  console.log('  GET  /scan-status/:sessionId');
  console.log('  GET  /suggestions/:sessionId');
  console.log('  POST /upload-image');
  console.log('  POST /stripe/webhook');
  console.log('  POST /stripe/create-checkout');
  console.log('  GET  /stripe/subscription/:userId');
  console.log('  GET  /profile/:userId');
  console.log('  GET  /history/:userId');
  console.log('  POST /feedback');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
