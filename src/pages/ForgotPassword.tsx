import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScaleIn } from "@/components/animations";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
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
                <CardTitle className="text-2xl display-font text-primary">
                  {isSubmitted ? "Check Your Email" : "Reset Password"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {isSubmitted 
                    ? "We've sent password reset instructions to your email address."
                    : "Enter your email address and we'll send you a link to reset your password."
                  }
                </CardDescription>
              </CardHeader>

            <CardContent>
              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    If an account with that email exists, you'll receive password reset instructions shortly.
                  </p>
                  <div className="space-y-2">
                    <Link to="/login">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Back to Login
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail("");
                      }}
                    >
                      Try Different Email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}

              {!isSubmitted && (
                <div className="mt-6 text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </ScaleIn>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;