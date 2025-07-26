// Mock API for style suggestions
// In Phase 3, this will be replaced with real AI model integration

const MOCK_SUGGESTIONS = {
  'brunch': [
    '#SoftLife',
    '#CasualChic',
    '#SunKissedGlow',
    '#MinimalistVibes',
    '#NaturalBeauty',
    '#EffortlessStyle'
  ],
  'interview': [
    '#BusinessChic',
    '#PowerLook',
    '#ProfessionalGlow',
    '#ConfidentVibes',
    '#PolishedStyle',
    '#ExecutivePresence'
  ],
  'breakup glow-up': [
    '#BoldBrowEnergy',
    '#FierceLook',
    '#ConfidenceBoost',
    '#GlowUp',
    '#NewMeVibes',
    '#PowerfulPresence'
  ],
  'vacation': [
    '#TropicalVibes',
    '#BeachGlow',
    '#SunsetLook',
    '#VacayMood',
    '#IslandStyle',
    '#RelaxedGlam'
  ],
  'boss energy': [
    '#CEOVibes',
    '#PowerSuit',
    '#LeadershipLook',
    '#BossLady',
    '#AuthorityStyle',
    '#CommandingPresence'
  ],
  'wedding guest': [
    '#ElegantGuest',
    '#WeddingGlam',
    '#CelebrationLook',
    '#FormalChic',
    '#PartyReady',
    '#SpecialOccasion'
  ]
};

const FACE_SHAPE_SUGGESTIONS = {
  'round': [
    '#AngularContour',
    '#DefinedCheeks',
    '#SlimmingTechnique',
    '#StructuredLook'
  ],
  'oval': [
    '#ClassicBeauty',
    '#VersatileStyle',
    '#TimelessLook',
    '#BalancedFeatures'
  ],
  'square': [
    '#SoftContour',
    '#RoundedFeatures',
    '#GentleCurves',
    '#SofteningTechnique'
  ],
  'heart': [
    '#BalancedLook',
    '#JawlineEnhance',
    '#ProportionedStyle',
    '#HarmoniousFeatures'
  ]
};

export const generateSuggestions = async (mood, faceShape = 'oval', userRole = 'free') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const moodKey = mood.toLowerCase();
    const moodSuggestions = MOCK_SUGGESTIONS[moodKey] || MOCK_SUGGESTIONS['brunch'];
    const faceShapeSuggestions = FACE_SHAPE_SUGGESTIONS[faceShape] || FACE_SHAPE_SUGGESTIONS['oval'];
    
    // Combine mood and face shape suggestions
    const allSuggestions = [...moodSuggestions, ...faceShapeSuggestions];
    
    // Limit suggestions based on user role
    let limitedSuggestions;
    if (userRole === 'pro') {
      limitedSuggestions = allSuggestions;
    } else if (userRole === 'free') {
      limitedSuggestions = allSuggestions.slice(0, 6);
    } else {
      limitedSuggestions = allSuggestions.slice(0, 3);
    }

    return {
      success: true,
      data: {
        suggestions: limitedSuggestions,
        mood: mood,
        faceShape: faceShape,
        confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const analyzeFaceShape = async (imageData) => {
  // Mock face shape analysis
  // In Phase 3, this will use real AI model
  await new Promise(resolve => setTimeout(resolve, 2000));

  const faceShapes = ['round', 'oval', 'square', 'heart'];
  const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
  
  return {
    success: true,
    data: {
      faceShape: randomShape,
      confidence: Math.random() * 0.2 + 0.8, // Random confidence between 0.8-1.0
      features: {
        jawline: Math.random() > 0.5 ? 'defined' : 'soft',
        cheekbones: Math.random() > 0.5 ? 'prominent' : 'subtle',
        forehead: Math.random() > 0.5 ? 'wide' : 'narrow'
      }
    }
  };
};

export const getPersonalizedRecommendations = async (userId, scanHistory) => {
  // Mock personalized recommendations based on scan history
  await new Promise(resolve => setTimeout(resolve, 1500));

  const recommendations = [
    '#YourSignatureStyle',
    '#PersonalizedLook',
    '#TailoredForYou',
    '#YourBestFeatures',
    '#CustomStyle'
  ];

  return {
    success: true,
    data: {
      recommendations,
      basedOn: 'Previous scans and preferences',
      confidence: 0.85
    }
  };
};

