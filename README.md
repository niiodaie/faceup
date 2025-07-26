# FaceUp - Phase 2 Complete

**Be Seen. Be Styled. Be You.**

FaceUp is an AI-powered beauty and style recommendation app that helps users discover their perfect look through face scanning, mood-based suggestions, and personalized style recommendations.

## 🚀 Phase 2 Features

### ✅ Authentication & User Management
- **Supabase Authentication**: Email/password signup and login
- **User Roles**: Guest, Free, and Pro tiers with different access levels
- **Session Management**: Persistent login state with automatic token refresh

### ✅ Role-Based Access Control
- **Guest Users**: Demo mode with limited suggestions and affiliate links
- **Free Users**: Face scanning, limited suggestions (4), mood selection
- **Pro Users**: Unlimited suggestions, save images, AR try-on, scan history

### ✅ Guest Demo Experience
- **Try Before Signup**: Guest demo mode with sample suggestions
- **Conversion Flow**: Seamless transition from guest to registered user
- **Feature Previews**: Clear indication of locked premium features

### ✅ Backend Infrastructure
- **Supabase Storage**: Secure image storage with user-specific folders
- **Database Schema**: Scan results, user metadata, and history tracking
- **Row Level Security**: Data isolation between users

### ✅ Mock AI Integration
- **Style Suggestions API**: Mood-based recommendations with face shape analysis
- **Personalized Results**: Dynamic suggestions based on user preferences
- **Confidence Scoring**: AI confidence levels for suggestions

### ✅ Monetization Features
- **Affiliate Links**: Product recommendations with commission tracking
- **Upgrade Prompts**: Clear Pro feature benefits and upgrade paths
- **VNX Branding**: Powered by VNX technology attribution

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS
- **UI Components**: Shadcn/UI + Lucide Icons
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Styling**: TailwindCSS with custom gradients

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd faceup-main/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the SQL schema in `backend/supabase/schema.sql` in your Supabase SQL editor
   - This creates the necessary tables, storage buckets, and RLS policies

5. **Start Development Server**
   ```bash
   pnpm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 🗄️ Database Schema

### Tables
- **scan_results**: User scan history with images, moods, and suggestions
- **auth.users**: Supabase managed user authentication

### Storage Buckets
- **face-scans**: User uploaded face scan images with RLS policies

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data isolation
- Secure image storage with folder-based access control

## 🎯 User Roles & Permissions

| Feature | Guest | Free | Pro |
|---------|-------|------|-----|
| Demo Mode | ✅ | ❌ | ❌ |
| Face Scanning | ❌ | ✅ | ✅ |
| Mood Selection | ✅ (Demo) | ✅ | ✅ |
| Style Suggestions | 2 | 4 | Unlimited |
| Save Images | ❌ | ❌ | ✅ |
| AR Try-On | ❌ | ❌ | ✅ |
| Scan History | ❌ | ❌ | ✅ |
| Affiliate Links | ✅ | ✅ | ✅ |

## 🔧 Development

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Project Structure
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/UI components
│   │   ├── Auth.jsx        # Authentication component
│   │   ├── GuestDemo.jsx   # Guest demo experience
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   └── useUserRole.js  # User role management
│   ├── api/                # API utilities
│   │   └── suggestions.js  # Mock AI suggestions
│   ├── utils/              # Utility functions
│   │   └── imageStorage.js # Supabase storage helpers
│   └── supabaseClient.js   # Supabase configuration
├── public/                 # Static assets
└── backend/               # Backend configuration
    └── supabase/          # Database schema
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Configuration
1. Create a new Supabase project
2. Run the schema SQL in the SQL editor
3. Configure authentication providers if needed
4. Update environment variables with your project credentials

## 🔮 Phase 3 Roadmap

### Planned Features
- **Stripe Integration**: Pro subscription billing and payment processing
- **Real AI Models**: Integration with HuggingFace/Replicate for actual face analysis
- **AR Try-On**: Real AR overlay functionality with camera integration
- **Advanced Analytics**: User behavior tracking and conversion optimization
- **Social Features**: Share looks, community recommendations
- **Mobile App**: React Native version for iOS/Android

### Technical Improvements
- **Performance**: Image optimization and lazy loading
- **PWA**: Progressive Web App capabilities
- **Internationalization**: Multi-language support with i18next
- **Testing**: Unit and integration test coverage
- **CI/CD**: Automated testing and deployment pipelines

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Powered by VNX** - Advanced AI technology for beauty and style recommendations.

