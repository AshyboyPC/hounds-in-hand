import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScaleIn } from "@/components/animations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ShelterAccessDialog from "@/components/ShelterAccessDialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsAdminVerification, setNeedsAdminVerification] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showShelterDialog, setShowShelterDialog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, verifyAdmin } = useAuth();

  useEffect(() => {
    // Check if redirected from protected route needing admin verification
    const needsVerification = location.state?.needsAdminVerification;

    if (needsVerification) {
      setNeedsAdminVerification(true);
      setError("Please enter your secondary admin password to continue.");
    }

    // If already logged in and not needing verification, and dialog is not showing, redirect
    if (session && profile && !needsVerification && !needsAdminVerification && !showShelterDialog) {
      const role = profile.role;

      if (role === 'shelter' || role === 'admin') {
        navigate('/dashboard/shelter');
      } else {
        navigate('/dashboard/community');
      }
    }
  }, [session, profile, location, needsAdminVerification, showShelterDialog, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const name = data.user.user_metadata?.full_name || email.split('@')[0];
        toast.success(`Welcome back, ${name}!`);
        
        // Show shelter access dialog instead of immediately redirecting
        setShowShelterDialog(true);
        setIsLoading(false);
      }

    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      // The user will be redirected to Google, so we don't need to do anything else here
      // The useEffect hook will handle the session when they return

    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "Google login failed. Please try again.");
    }
  };

  const handleAdminVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this should be a server-side check or a separate auth factor
    // For demo purposes, we check against a hardcoded hash/value
    if (adminPassword === "admin-secure-123") {
      verifyAdmin();
      toast.success("Admin verified successfully");
      navigate("/dashboard/admin");
    } else {
      setError("Invalid admin password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ShelterAccessDialog
        open={showShelterDialog}
        onContinueToCommunity={() => {
          setShowShelterDialog(false);
          navigate('/dashboard/community');
        }}
        onShelterAccess={() => {
          setShowShelterDialog(false);
          navigate('/dashboard/shelter');
        }}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-warning/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-destructive/5 rounded-full blur-xl"></div>
        </div>

        <ScaleIn delay={0.1}>
          <div className="w-full max-w-md relative z-10">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mb-4">
                  {needsAdminVerification ? (
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
                  ) : (
                    <Heart className="w-12 h-12 text-destructive mx-auto mb-2" fill="currentColor" />
                  )}
                </div>
                <CardTitle className="text-2xl display-font text-primary">
                  {needsAdminVerification ? "Admin Verification" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {needsAdminVerification
                    ? "Please enter your secondary security password"
                    : "Sign in to access your Connect 4 Paws dashboard"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {needsAdminVerification ? (
                  <form onSubmit={handleAdminVerification} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Secondary Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter admin code"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Verify Identity</Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          const { error } = await supabase.auth.updateUser({
                            data: { role: 'volunteer' }
                          });
                          if (error) throw error;

                          await supabase.auth.refreshSession();
                          toast.success("Switched to Volunteer view");
                          navigate("/dashboard/volunteer");
                        } catch (err: any) {
                          setError(err.message || "Failed to switch role");
                          setIsLoading(false);
                        }
                      }}
                    >
                      Continue as Volunteer (Skip Admin)
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => {
                        setNeedsAdminVerification(false);
                        setError("");
                      }}
                    >
                      Back to Login
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>



                      <div className="flex items-center justify-between">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={handleGoogleLogin}
                    >
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                )}

                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Want to help?{" "}
                    <Link to="/volunteer" className="text-primary hover:underline font-semibold">
                      Browse volunteer opportunities
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Login to sign up and track your volunteer hours)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScaleIn>
      </main>

      <Footer />
    </div>
  );
};

export default Login;