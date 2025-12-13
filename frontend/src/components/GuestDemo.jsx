export default function GuestDemo({ onSignUp }) {
  const navigate = useNavigate();
  const { guestTrialEnd } = useSession();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  const daysLeft = (() => {
    if (!guestTrialEnd) return 0;
    const diff = guestTrialEnd - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  useEffect(() => {
    if (daysLeft <= 0) onSignUp();
  }, [daysLeft, onSignUp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-3">FACEUP</h1>
          <p className="text-gray-600">Be Seen. Be Styled. Be You.</p>
        </div>

        {/* TRIAL CARD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Free Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card>
          <CardContent className="space-y-4">

            <Button
              onClick={() => setShowDemo(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Camera className="mr-2 h-4 w-4" />
              Try Demo Scan
            </Button>

            {showDemo && (
              <>
                <MoodSelector
                  selectedMoods={selectedMoods}
                  onMoodToggle={(m) =>
                    setSelectedMoods((prev) =>
                      prev.includes(m)
                        ? prev.filter((x) => x !== m)
                        : [...prev, m]
                    )
                  }
                />

                <CutMatchSuggestions
                  userRole={USER_ROLES.GUEST}
                  hasAccess={hasAccess}
                />
              </>
            )}

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                onClick={() => navigate('/auth/signup')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Sign Up Free
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/auth/login')}
              >
                Log In
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
