# FaceUp Backend API

Production-ready Node.js/Express backend server for the FaceUp application.

## Features

- **Face Analysis**: Real face scanning using Replicate API
- **AI Suggestions**: Hairstyle recommendations powered by OpenAI GPT-4
- **User Management**: Supabase authentication and database integration
- **Payments**: Stripe subscription handling with webhooks
- **File Upload**: Image upload to Supabase Storage
- **RESTful API**: Clean, documented endpoints for mobile and web clients

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Services**: Replicate, OpenAI
- **Payments**: Stripe
- **File Storage**: Supabase Storage

## Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Supabase account and project
- Replicate API key
- OpenAI API key
- Stripe account

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services
REPLICATE_API_KEY=your-replicate-key
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://www.faceupstyle.com
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and version information.

### Face Scan

```
POST /face-scan
Content-Type: application/json

{
  "userId": "uuid-or-null-for-guest",
  "imageUrl": "https://...",
  "mood": "professional",
  "style": "modern",
  "gender": "female"
}

Response:
{
  "sessionId": "uuid",
  "status": "processing",
  "message": "Face scan started..."
}
```

### Scan Status

```
GET /scan-status/:sessionId

Response:
{
  "sessionId": "uuid",
  "status": "completed",
  "progress": 100,
  "faceAnalysis": {...},
  "suggestions": [...],
  "generalAdvice": "..."
}
```

### Get Suggestions

```
GET /suggestions/:sessionId

Response:
{
  "sessionId": "uuid",
  "faceAnalysis": {...},
  "suggestions": [...],
  "generalAdvice": "..."
}
```

### Upload Image

```
POST /upload-image
Content-Type: multipart/form-data

FormData:
- image: File

Response:
{
  "success": true,
  "imageUrl": "https://...",
  "filename": "..."
}
```

### Stripe Checkout

```
POST /stripe/create-checkout
Content-Type: application/json

{
  "userId": "uuid",
  "priceId": "price_xxx",
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}

Response:
{
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

### Subscription Status

```
GET /stripe/subscription/:userId

Response:
{
  "hasSubscription": true,
  "status": "active",
  "planType": "monthly",
  "currentPeriodEnd": "2024-01-01T00:00:00Z"
}
```

### User History

```
GET /history/:userId?limit=10&offset=0

Response:
{
  "sessions": [...],
  "count": 10
}
```

### Submit Feedback

```
POST /feedback
Content-Type: application/json

{
  "userId": "uuid",
  "sessionId": "uuid",
  "rating": 5,
  "comment": "Great suggestions!",
  "feedbackType": "positive"
}
```

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables from `.env.example`
5. Deploy!

### Webhook Configuration

After deployment, configure Stripe webhook:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api.onrender.com/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Main Express server
│   ├── faceScan.js           # Face scan endpoints
│   ├── stripeWebhook.js      # Stripe webhook handlers
│   ├── supabaseService.js    # Supabase database operations
│   ├── replicateService.js   # Replicate AI integration
│   └── openaiService.js      # OpenAI GPT integration
├── package.json
├── .env.example
└── README.md
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Resource not found
- `500`: Internal server error

## Security

- CORS configured for frontend domain only
- Stripe webhook signature verification
- Supabase RLS policies enforced
- Service role key used only on backend
- File upload size limits (10MB)
- Image-only file type validation

## Monitoring

Check server health:

```bash
curl https://your-api.onrender.com/health
```

View logs on Render dashboard or use:

```bash
render logs
```

## Support

For issues or questions, contact the FaceUp development team.
