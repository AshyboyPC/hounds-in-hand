import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Heart, Lock, Mail, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScaleIn } from "@/components/animations";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock user data for demonstration
  const mockUsers = {
    "volunteer@hopeforhounds.org": { password: "volunteer123", role: "volunteer", name: "Sarah Johnson" },
    "staff@hopeforhounds.org": { password: "staff123", role: "staff", name: "Mike Chen" },
    "admin@hopeforhounds.org": { password: "admin123", role: "admin", name: "Dr. Emily Rodriguez" }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user || user.password !== password) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Store user session (in real app, use proper auth)
    localStorage.setItem("user", JSON.stringify({
      email,
      role: user.role,
      name: user.name
    }));

    // Redirect based on role
    switch (user.role) {
      case "volunteer":
        navigate("/dashboard/volunteer");
        break;
      case "staff":
        navigate("/dashboard/staff");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      default:
        navigate("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                  <Heart className="w-12 h-12 text-destructive mx-auto mb-2" fill="currentColor" />
                </div>
                <CardTitle className="text-2xl display-font text-primary">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to access your Connect 4 Paws dashboard
                </CardDescription>
              </CardHeader>

            <CardContent>
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

              <Separator className="my-6" />

              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-4">Demo Accounts:</p>
                <div className="space-y-2 text-xs bg-muted/50 p-3 rounded-lg">
                  <p><strong>Volunteer:</strong> volunteer@hopeforhounds.org / volunteer123</p>
                  <p><strong>Staff:</strong> staff@hopeforhounds.org / staff123</p>
                  <p><strong>Admin:</strong> admin@hopeforhounds.org / admin123</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  New volunteer?{" "}
                  <Link to="/volunteer" className="text-primary hover:underline">
                    Apply to volunteer
                  </Link>
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